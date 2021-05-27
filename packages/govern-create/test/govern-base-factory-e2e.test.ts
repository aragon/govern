import { deployments, ethers, network, waffle } from 'hardhat'
import { expect } from 'chai'
import { GovernBaseFactory, GovernRegistry } from '../typechain'

import { ERC3000DefaultConfig } from 'erc3k/utils/ERC3000'

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata',
}

describe('Govern Base Factory with the real contracts(NO MOCKs)', function () {
  let signers, owner:any
  beforeEach(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
    await deployments.fixture()
  })

  const deployDAO = async (
    useProxies: boolean,
    gasTarget: number,
    deployToken = false
  ) => {
    const registryDeployment = await deployments.get('GovernRegistry')
    const registryContract = (await ethers.getContractAt(
      'GovernRegistry',
      registryDeployment.address
    )) as GovernRegistry

    const baseFactoryDeployment = await deployments.get('GovernBaseFactory')
    const baseFactoryContract = (await ethers.getContractAt(
      'GovernBaseFactory',
      baseFactoryDeployment.address
    )) as GovernBaseFactory

    const tx = baseFactoryContract.newGovern(
      'eagle',
      {
        tokenAddress: `0x${(deployToken ? '00' : '11').repeat(20)}`,
        tokenDecimals: 18,
        tokenName: 'Eaglet Token',
        tokenSymbol: 'EAG',
        mintAddress: owner,
        mintAmount: 100,
        merkleRoot: '0x'+'00'.repeat(32),
        merkleMintAmount:0
      },
      ERC3000DefaultConfig,
      [],
      useProxies,
    )

    await expect(tx).to.emit(registryContract, EVENTS.REGISTERED)
    await expect(tx).to.emit(registryContract, EVENTS.SET_METADATA)

    const { hash } = await tx
    const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)

    expect(gasUsed).to.be.lte(gasTarget)
  }

  const GAS_TARGET = network.name !== 'hardhat' ? 5.5e6 : 20e6
  const GAS_TARGET_PROXY = network.name !== 'hardhat' ? 6e5 : 2e6

  it(`deploys DAO with custom token and doesn't use proxies under ${GAS_TARGET} gas`, async () => {
    await deployDAO(false, GAS_TARGET, false)
  })

  it(`deploys DAO with new token and doesn't use proxies under ${GAS_TARGET} gas`, async () => {
    await deployDAO(false, GAS_TARGET, true)
  })

  it(`deploys DAO with new token and uses proxies under ${GAS_TARGET_PROXY} gas`, async () => {
    await deployDAO(true, GAS_TARGET_PROXY, true)
  })

  it(`deploys DAO with custom token and uses proxies under ${GAS_TARGET_PROXY} gas`, async () => {
    await deployDAO(true, GAS_TARGET_PROXY, false)
  })
})
