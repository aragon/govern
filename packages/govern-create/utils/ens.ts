import { Contract, constants, utils, providers, VoidSigner, Signer } from 'ethers'

const ensAbi = [
  "function resolver(bytes32 node) external view returns (address)",
  "function owner(bytes32 node) external view returns (address)",
  "function setOwner(bytes32 node, address owner) external @500000",
  "function setRecord(bytes32 node, address owner, address resolver, uint64 ttl) external",
  "function setSubnodeOwner(bytes32 node, bytes32 label, address owner) public",
  "function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) external"
]

const resolverAbi = [
  "function interfaceImplementer(bytes32 nodehash, bytes4 interfaceId) view returns (address)",
  "function addr(bytes32 nodehash) view returns (address)",
  "function setAddr(bytes32 nodehash, address addr) @500000"
]

const ethRegistrarAbi = ['function reclaim(uint256 id, address owner) external']


function isSameAddress(address1: string, address2: string): boolean {
  try {
    const normalizedAddress1 = utils.getAddress(address1)
    const normalizedAddress2 = utils.getAddress(address2)
    return normalizedAddress1 === normalizedAddress2
  }
  catch (error) {
    return false
  }
}

function isValidAddress(address: string) {
  return utils.isAddress(address) && address !== constants.AddressZero
}


export class Ens {
  protected readonly signer: Signer
  readonly ens: Contract
  private readonly web3Provider: providers.Web3Provider

  constructor(provider: any, network: providers.Network, readonly: boolean = false) {
    this.web3Provider = new providers.Web3Provider(provider, network)
    if( readonly ) {
      this.signer = new VoidSigner(constants.AddressZero, this.web3Provider)
      this.ens = new Contract(network.ensAddress!, ensAbi, this.web3Provider);
    } else {
      this.signer = this.web3Provider.getSigner()
      this.ens = new Contract(network.ensAddress!, ensAbi, this.signer);
    }
  }

  static async createEns(provider: any, readonly: boolean = false): Promise<Ens> {
    const web3 = new providers.Web3Provider(provider)
    const network = await web3.getNetwork()
    if (!network.ensAddress) {
      throw new Error('ENS is not defined in this environment')
    }

    return new Ens(provider, network, readonly)
  }

  async getResolver(nodehash: string): Promise<Contract> {
    const address = await this.ens.resolver(nodehash)
    if (!isValidAddress(address)) {
      throw new Error('ENS name not found')
    }

    return new Contract(address, resolverAbi, this.signer);
  }

  async getEthRegistrar(signer?: Signer): Promise<Contract> {
    const address = await this.ens.owner(utils.namehash("eth"));
    return new Contract(address, ethRegistrarAbi, signer || this.web3Provider);
  }

  async setAddr(name: string, address: string): Promise<providers.TransactionResponse> {
    if (!isValidAddress(address)) {
      throw new Error('Invalid address')
    }

    const nodehash = utils.namehash(name)
    const resolver = await this.getResolver(nodehash);
    const currentAddress = await resolver.addr(nodehash)
    return isSameAddress(address, currentAddress)? null: resolver.setAddr(nodehash, address)
  }

  async getOwner(name: string): Promise<string> {
    const nodehash = utils.namehash(name)
    return this.ens.owner(nodehash)
  }
}
