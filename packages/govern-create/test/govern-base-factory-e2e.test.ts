import { deployments, ethers, network, waffle } from 'hardhat'
import { GovernBaseFactory, GovernRegistry } from '../typechain'
import { ERC3000DefaultConfig } from 'erc3k/utils/ERC3000'
import { getConfigHash } from 'erc3k/utils/ERC3000';
import { BigNumber } from 'ethers';
import { container } from '@aragon/govern-core/test/pipelines/container';

// Overriding chai utils is important otherwise, checking event arguments
// with structs fail...
import chai, { expect } from 'chai'
import chaiUtils from '@aragon/govern-core/test/chai-utils'
chai.use(chaiUtils);

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata',
  CONFIGURED: 'Configured',
}

const ERRORS = {
  SCHEDULE_EXCEEDED: 'basefactory: schedule list exceeded',
  ACL_AUTH: 'acl: auth'
}

const CUSTOM_ADDRESS = '0x' + '11'.repeat(20)
const ZERO_ADDRESS = '0x' + '00'.repeat(20)

const ZERO_BYTES32 = '0x' + '00'.repeat(32)
const CUSTOM_BYTES32 = '0x' + '11'.repeat(32)

const tokenConfig = {
  tokenAddress: ZERO_ADDRESS,
  tokenDecimals: 18,
  tokenName: 'Eaglet Token',
  tokenSymbol: 'EAG',
  mintAddress: ZERO_ADDRESS,
  mintAmount: 100,
  merkleRoot: ZERO_BYTES32,
  merkleMintAmount:0
}

const GAS_TARGET = network.name !== 'hardhat' ? 5.5e6 : 20e6
const GAS_TARGET_PROXY = network.name !== 'hardhat' ? 6e5 : 2e6

const SCHEDULE_LIST_LIMIT = 10

describe('Govern Base Factory with the real contracts(NO MOCKs)', function () {
  let signers:any, owner:any, signer1: any, signer2:any
  let governBaseFactory: any

  let governQueueFactory:any, governTokenFactory:any, governRegistry:any, governFactory:any

  // Merge the abis so base factory's transaction can still get all the events decoded
  async function getMergedABI() {
    // @ts-ignore
    const baseFactoryArtifact = await hre.artifacts.readArtifact('GovernBaseFactory')
    // @ts-ignore
    const tokenFactoryArtifact = await hre.artifacts.readArtifact('GovernTokenFactory');
    // @ts-ignore
    const minterArtifact = await hre.artifacts.readArtifact('GovernMinter');
    // @ts-ignore
    const registryArtifact = await hre.artifacts.readArtifact('GovernRegistry');
    // @ts-ignore
    const governQueueArtifact = await hre.artifacts.readArtifact('GovernQueue');

    return {
      abi:[
        ...baseFactoryArtifact.abi,
        ...tokenFactoryArtifact.abi.filter((f: any) => f.type === 'event'),
        ...minterArtifact.abi.filter((f: any) => f.type === 'event'),
        ...registryArtifact.abi.filter((f: any) => f.type === 'event'),
        ...governQueueArtifact.abi.filter((f: any) => f.type === 'event')
      ],
      baseFactoryBytecode: baseFactoryArtifact.bytecode
    }
  }

  // This changes the ERC3000DefaultConfig 
  function updateConfig({ scheduleToken, challengeToken }: {scheduleToken: string, challengeToken: string}) {
    return {
      ...ERC3000DefaultConfig,
      scheduleDeposit: {
        token: scheduleToken,
        amount: ERC3000DefaultConfig.scheduleDeposit.amount
      },
      challengeDeposit: {
        token: challengeToken,
        amount: ERC3000DefaultConfig.challengeDeposit.amount,
      }
    }
  }

  async function updateContainer({ submitter, config }: {submitter: string, config: any}) {
    return {
      payload: {
        ...container.payload,
        executionTime: (await ethers.provider.getBlock('latest')).timestamp + config.executionDelay + 100,
        submitter: submitter,
      },
      config
    }
  }

  // This transforms config into specific array config
  // so that we can directly put it inside mocha's withArgs
  function updateConfigForArgs(config: any) {
    return [
      config.executionDelay,
      [
        config.scheduleDeposit.token,
        BigNumber.from(config.scheduleDeposit.amount),
      ],
      [
        config.challengeDeposit.token,
        BigNumber.from(config.challengeDeposit.amount),
      ],
      config.resolver,
      config.rules,
      config.maxCalldataSize
    ]
  }

  async function getDeployments(tx: any) {
    const { events } = await tx.wait()
    const { executor, queue, token } = events.find(
      ({ event }: {event:any}) => event === EVENTS.REGISTERED
    ).args
    return {
      queue: await ethers.getContractAt('GovernQueue', queue),
      govern: await ethers.getContractAt('Govern', executor),
      token: await ethers.getContractAt('GovernToken', token),
    }
  }

  before(async () => {
    await deployments.fixture()
    
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
    signer1 = await signers[1].getAddress()
    signer2 = await signers[2].getAddress()

    governRegistry = (await ethers.getContractAt(
      'GovernRegistry',
      (await deployments.get('GovernRegistry')).address
    )) as GovernRegistry

    governQueueFactory = (await ethers.getContractAt(
      'GovernRegistry',
      (await deployments.get('GovernQueueFactory')).address
    )) as GovernRegistry

    governTokenFactory = (await ethers.getContractAt(
      'GovernRegistry',
      (await deployments.get('GovernTokenFactory')).address
    )) as GovernRegistry

    governFactory = (await ethers.getContractAt(
      'GovernRegistry',
      (await deployments.get('GovernFactory')).address
    )) as GovernRegistry

    
    const { abi, baseFactoryBytecode } = await getMergedABI();

    const GovernBaseFactory = new ethers.ContractFactory(abi, baseFactoryBytecode, signers[0]);

    governBaseFactory = await GovernBaseFactory.deploy(
      governRegistry.address,
      governFactory.address,
      governQueueFactory.address,
      governTokenFactory.address
    );
  
  })

  describe('dao deployments with permission checking', async () => {
    it(`reverts if schedule access list is more than allowed`, async () => {
      const tx = governBaseFactory.newGovern(
        tokenConfig,
        Array(SCHEDULE_LIST_LIMIT + 1).fill(owner),
        true,
        ERC3000DefaultConfig,
        'eagle',
      )
      await expect(tx).to.be.revertedWith(ERRORS.SCHEDULE_EXCEEDED)
    })

    it(`should deploy dao with new token, set schedule collateral to user's token, challenge collatral to new token`, async () => {
      const tx =  await governBaseFactory.newGovern(
        {
          ...tokenConfig,
          mintAddress: owner,
        },
        [],
        true,
        {
          ...ERC3000DefaultConfig,
          challengeDeposit: {
            ...ERC3000DefaultConfig.challengeDeposit,
            token: CUSTOM_ADDRESS
          }
        },
        'eagle1',
      )

      const { token, queue } = await getDeployments(tx);
      
      const config = updateConfig({scheduleToken: token.address, challengeToken: CUSTOM_ADDRESS})

      await expect(tx).to.emit(queue, EVENTS.CONFIGURED)
      .withArgs(getConfigHash(config), governBaseFactory.address, updateConfigForArgs(config))
      
      await expect(queue.configure(ERC3000DefaultConfig)).to.be.revertedWith(ERRORS.ACL_AUTH)
      
      // TODO: Giorgi
      // connect from governbasefactory and call configure , it should again revert as above.
      // connect from govern and call configure, it should succeed
      // 
    })

    it(`should deploy dao with custom token and change config with this token`, async () => {
      const config = updateConfig({scheduleToken: CUSTOM_ADDRESS, challengeToken: CUSTOM_ADDRESS})

      const tx =  await governBaseFactory.newGovern(
        {
          ...tokenConfig,
          tokenAddress: CUSTOM_ADDRESS,
          mintAddress: owner,
        },
        [],
        true,
        config,
        'eagle2',
      )

      const { queue } = await getDeployments(tx);

      await expect(tx).to.emit(queue, EVENTS.CONFIGURED)
      .withArgs(getConfigHash(config), governQueueFactory.address, updateConfigForArgs(config))
    })

    it('deploys dao with schedule access list and checks permissions', async () => {
      const tx =  await governBaseFactory.newGovern(
        {
          ...tokenConfig,
          mintAddress: owner,
        },
        [signer1],
        true,
        ERC3000DefaultConfig,
        'eagle3',
      )

      const { token, queue } = await getDeployments(tx);
      
      const config = updateConfig({scheduleToken: token.address, challengeToken: token.address})
      let container = await updateContainer({ submitter: owner, config: config})
      
      // calling schedule from different address than address 
      // that was specified in schedule access list should revert
      await expect(queue.schedule(container)).to.be.revertedWith(ERRORS.ACL_AUTH);
    
      // call schedule from the address that was passed as schedule list access
      // if this doesn't fail, it means it was allowed
      container = await updateContainer({ submitter: signer1, config: config})
      await expect(await (queue.connect(signers[1]).schedule(container)) )
    })
  })
  
  const options = [
    {
      useProxies:false,
      deployToken: false,
      title: "Deploys Dao with custom token and doesn't use proxies",
      GAS_TARGET: GAS_TARGET
    },
    {
      useProxies:true,
      deployToken: false,
      title: "Deploys Dao with custom token and uses proxies",
      GAS_TARGET: GAS_TARGET_PROXY
    },
    {
      useProxies:true,
      deployToken: true,
      title: "Deploys Dao with new token and uses proxies",
      GAS_TARGET: GAS_TARGET_PROXY
    },
    {
      useProxies:false,
      deployToken: true,
      title: "Deploys Dao with new token and doesn't use proxies",
      GAS_TARGET: GAS_TARGET
    }, 
    {
      useProxies:false,
      deployToken: true,
      title: "Deploys Dao with new token, doesn't use proxies and uses merkle distributor",
      merkleRoot: '0x' + '11'.repeat(32),
      GAS_TARGET: GAS_TARGET
    },
  ]

  describe("GAS Cost Check Tests", async () => {
    options.forEach(async (item, index) => {
      it(`${item.title}`, async () => {
        const tx =  await governBaseFactory.newGovern(
          {
            ...tokenConfig,
            tokenAddress: item.deployToken ? ZERO_ADDRESS : CUSTOM_ADDRESS,
            merkleRoot: item.merkleRoot ? CUSTOM_BYTES32 : ZERO_BYTES32
          },
          [signer1],
          item.useProxies,
          ERC3000DefaultConfig,
          `DAO${index}`,
        )
        await expect(tx).to.emit(governRegistry, EVENTS.REGISTERED)
        await expect(tx).to.emit(governRegistry, EVENTS.SET_METADATA)
      
        const { hash } = await tx
        const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)
    
        expect(gasUsed).to.be.lte(item.GAS_TARGET)
      })
    })
  })

})
