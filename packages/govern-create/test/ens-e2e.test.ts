import { ethers, network } from 'hardhat'
import { Ens } from '../utils/ens'
import { Signer, Wallet, Contract, providers, utils, constants } from 'ethers'
import { RINKEBY_URL } from '../utils/network'

import chai, { expect } from 'chai'
import { solidity } from 'ethereum-waffle';
chai.use(solidity);


const InterfaceID_Controller  = "0x018fac06";

const ethControllerAbi = [
  'function rentPrice(string memory name, uint duration) view public returns(uint)',
  'function available(string memory label) public view returns(bool)',
  'function commit(bytes32 commitment) public @500000',
  'function makeCommitmentWithConfig(string memory name, address owner, bytes32 secret, address resolver, address addr) pure public returns(bytes32)',
  'function registerWithConfig(string memory name, address owner, uint duration, bytes32 secret, address resolver, address addr) payable @500000'
];

const ethRegistrarAbi = [
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function reclaim(uint256 id, address owner) @500000',
  'function safeTransferFrom(address from, address to, uint256 tokenId) @500000',
  'function nameExpires(uint256 id) external view returns(uint)'
];

// fastforward time to speed up testing
async function advanceTime(seconds: number) {
  await network.provider.send("evm_increaseTime", [seconds])
  await network.provider.send("evm_mine")
}

function getNetwork(): providers.Network {
  const rinkebyNetwork = providers.getNetwork("rinkeby")
  return {
    name: network.name,
    chainId: network.config.chainId || 1337,
    ensAddress: rinkebyNetwork.ensAddress
  }
}

// TODO: remove this when the aragon rinkeby node is up
async function getJsonRpcUrl(): Promise<string> {
  let url: string = RINKEBY_URL
  const infuraProvider = new providers.InfuraProvider('rinkeby')

  try {
    const provider = new providers.JsonRpcProvider(url)
    await provider.getBlockNumber()
  } catch (err) {
    url = infuraProvider.connection.url
  }

  return url
}

class EnsHelper extends Ens {
  private controller: Contract
  private registrar: Contract

  constructor(provider: any, networkInfo: providers.Network, controllerAddress: string, registrarAddress: string) {
    super(provider, networkInfo)
    this.controller = new Contract(controllerAddress, ethControllerAbi, this.signer);
    this.registrar = new Contract(registrarAddress, ethRegistrarAbi, this.signer);
  }

  static async createEnsHelper(provider: any, networkInfo: providers.Network): Promise<EnsHelper> {
    const ens = new Ens(provider, networkInfo)
    const ethNodehash = utils.namehash("eth");
    const resolver = await ens.getResolver(ethNodehash);
    const controllerAddress = await resolver.interfaceImplementer(ethNodehash, InterfaceID_Controller);
    const registrarAddress = await ens.getOwner("eth");

    const ensHelper = new EnsHelper(provider, networkInfo, controllerAddress, registrarAddress)
    return ensHelper
  }

  async commit(args: any) {
    const { domain, owner, salt, resolver, address } = args
    try {
      const commitment = await this.controller.makeCommitmentWithConfig(domain, owner, salt, resolver, address);
      const commitTx = await this.controller.commit(commitment);
      await commitTx.wait()
    } catch (err) {
      console.log('failed to make commitment', err)
      throw err
    }
  }

  async register(args: any) {
    const { domain, owner, duration, salt, resolver, address } = args
    try {
      const fee = await this.controller.rentPrice(domain, duration);
      const overrides = { value: fee.mul(11).div(10) }
      const tx = await this.controller.registerWithConfig(domain, owner, duration, salt, resolver, address, overrides);
      await tx.wait()
    } catch (err) {
      console.log('failed to register', err)
      throw err
    }
  }

  async addSubdomain(args: any) {
    const { domain, subdomain, owner, resolver, ttl } = args
    try {
      const nodehash = ethers.utils.namehash(`${domain}.eth`)
      const labelhash = ethers.utils.id(subdomain)
      const subnodeTx = await this.ens.setSubnodeRecord(nodehash, labelhash, owner, resolver, ttl)
      await subnodeTx.wait()
    } catch (err) {
      console.log('failed to add subdomain', err)
      throw err
    }
  }

  async transfer(to: string, domain: string) {
    const owner = await this.signer.getAddress()
    const tokenId = utils.id(domain)

    try {
      const tx = await this.ens.setOwner(utils.namehash(`${domain}.eth`), to)
      await tx.wait()
    } catch (err) {
      console.log('failed to reclaim domain', err)
      throw err
    }

    try {
      const tx = await this.registrar.safeTransferFrom(owner, to, tokenId)
      await tx.wait()
    } catch (err) {
      console.log('failed to transfer domain', err)
      throw err
    }
  }

  async registerDomain(domain: string, subdomain :string) {
    const provider = this.signer.provider as providers.Provider
    const owner = await this.signer.getAddress()
    const signature = await this.signer.signMessage(`commit-${owner}-${domain}`);
    const salt = utils.keccak256(signature)
    const duration = 365 * 24 * 60 * 60
    const ttl = 0

    // use standard resolver
    const resolver = await provider.resolveName('resolver.eth')

    // the ENS name points to the signer's address by default
    const address = await this.signer.getAddress()

    // make a commitment to register the domain
    await this.commit({domain, owner, salt, resolver, address})

    // need to wait for 1 minute before registering
    advanceTime(60 * 60)

    // register the domain
    await this.register({domain, owner, duration, salt, resolver, address})

    // add subdomain
    await this.addSubdomain({domain, subdomain, owner, resolver, ttl})
  }
}

describe('ENS', function() {
  this.timeout(50000)

  let testSigner: Signer
  const subdomain = 'everything'
  const domain = 'isawesome'
  const name = `${subdomain}.${domain}.eth`
  const anotherDomain = 'tobetransferred'
  let ensNetwork: providers.Network
  let ensHelper: EnsHelper

  before(async function() {
    // fork from rinkeby
    const jsonRpcUrl = await getJsonRpcUrl()
    await network.provider.request({
      method: 'hardhat_reset',
      params: [{
        forking: {
          jsonRpcUrl
        }
      }]
    })

    ensNetwork = getNetwork()
    const web3Provider = new providers.Web3Provider(<any>network.provider, ensNetwork)
    testSigner = web3Provider.getSigner()

    ensHelper = await EnsHelper.createEnsHelper(network.provider, ensNetwork)
    await ensHelper.registerDomain(domain, subdomain)
    await ensHelper.registerDomain(anotherDomain, subdomain)
  })

  after(async function() {
    // reset back
    await network.provider.request({
      method: 'hardhat_reset',
      params: []
    })
  })

  it('set address by the owner should work', async function() {
    const ens = new Ens(network.provider, ensNetwork)
    const wallet = ethers.Wallet.createRandom()
    let tx = await ens.setAddr(name, wallet.address)
    await tx.wait()

    const provider = testSigner.provider as providers.Provider
    const address = await provider.resolveName(name)
    expect(address).to.eq(wallet.address)
  })

  it('set address by non-owner should throw', async function() {
    const wallet = Wallet.createRandom()
    await ensHelper.transfer(wallet.address, anotherDomain)

    const ens = new Ens(network.provider, ensNetwork)
    await expect(ens.setAddr(`${anotherDomain}.eth`, wallet.address)).to.be.reverted
  })

  it('set address with invalid address should throw', async function(){
    const ens = new Ens(network.provider, ensNetwork)
    let error: Error | undefined
    try {
      await ens.setAddr(`${domain}.eth`, '0x1234')
    } catch (err) {
      error = err
    }
    expect(error).to.be.an('Error')
  })

  it('set with the same address will return null', async function() {
    const ens = new Ens(network.provider, ensNetwork)
    const wallet = Wallet.createRandom()
    let tx = await ens.setAddr(name, wallet.address)
    await tx.wait()

    tx = await ens.setAddr(name, wallet.address)
    expect(tx).to.be.null
  })

  it('getOwner should return the owner of the ENS', async function(){
    const ens = new Ens(network.provider, ensNetwork)
    const owner = await ens.getOwner(name)
    const address = await testSigner.getAddress()
    expect(owner).to.eq(address)
  })

  it('getOwner should return zero for non-existent ENS name', async function(){
    const ens = new Ens(network.provider, ensNetwork)
    const owner = await ens.getOwner('nonexistentens')
    expect(owner).to.eq(constants.AddressZero)
  })

  it('getResolver with valid ens name should work', async function(){
    const ens = new Ens(network.provider, ensNetwork)
    const nodehash = utils.namehash(name)
    const resolver = await ens.getResolver(nodehash)
    expect(resolver).to.have.property('address')
  })

  it('getResolver with non-existent ens name should throw', async function() {
    const ens = new Ens(network.provider, ensNetwork)
    let error: Error | undefined
    try {
      const nodehash = utils.namehash('nonexistentens')
      await ens.getResolver(nodehash)
    } catch (err) {
      error = err
    }
    expect(error).to.be.an('Error')
  })
})
