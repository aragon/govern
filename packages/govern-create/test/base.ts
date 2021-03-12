import { deployments, ethers, network, waffle } from 'hardhat'
import { expect } from 'chai'
import { GovernBaseFactory, GovernRegistry } from '../typechain'

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata',
}

describe('Govern Base Factory', function () {
  beforeEach(async () => {
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

    const tx = baseFactoryContract.newGovernWithoutConfig(
      'eagle',
      `0x${(deployToken ? '00' : '11').repeat(20)}`, // NOTE: zero addr deploys a token
      'Eaglet Token',
      'EAG',
      useProxies
    )

    await expect(tx).to.emit(registryContract, EVENTS.REGISTERED)
    await expect(tx).to.emit(registryContract, EVENTS.SET_METADATA)

    const { hash } = await tx
    const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)

    expect(gasUsed).to.be.lte(gasTarget)

    console.log('gas used:', gasUsed.toNumber())
  }

  const GAS_TARGET = network.name !== 'hardhat' ? 5.5e6 : 20e6
  it(`deploys DAO under ${GAS_TARGET} gas`, async () => {
    await deployDAO(false, GAS_TARGET)
  })

  const GAS_TARGET_PROXY = network.name !== 'hardhat' ? 6e5 : 2e6
  it(`deploys DAO with proxies under ${GAS_TARGET_PROXY} gas`, async () => {
    await deployDAO(true, GAS_TARGET_PROXY)
  })

  // TODO: Implement tests
  it('deploys DAO with token')
})
