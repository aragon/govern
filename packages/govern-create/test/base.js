const { expect } = require("chai")

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata'
}

describe('Govern Base Factory', function () {
  let signers, owner, governFactory, queueFactory, governBaseFactory, registry

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const GovernQueueFactory = await ethers.getContractFactory('GovernQueueFactory')
    const GovernFactory = await ethers.getContractFactory('GovernFactory')

    governFactory = await GovernFactory.deploy()
    queueFactory = await GovernQueueFactory.deploy()

    const GovernRegistry = await ethers.getContractFactory('GovernRegistry')
    const GovernBaseFactory = await ethers.getContractFactory('GovernBaseFactory')

    registry = await GovernRegistry.deploy()
    governBaseFactory = await GovernBaseFactory.deploy(registry.address, governFactory.address, queueFactory.address)
  })

  const deployDAO = async (useProxies, gasTarget) => {
    const tx = governBaseFactory.newDummyGovern('eagle', useProxies)

    await expect(tx).to.emit(registry, EVENTS.REGISTERED)
    await expect(tx).to.emit(registry, EVENTS.SET_METADATA)

    const { hash } = await tx
    const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)

    expect(gasUsed).to.be.lte(gasTarget)

    console.log('gas used:', gasUsed.toNumber())
  }

  const GAS_TARGET = !process.env.SOLIDITY_COVERAGE ? 5e6 : 20e6
  it(`deploys DAO under ${GAS_TARGET} gas`, async () => {
    await deployDAO(false, GAS_TARGET)
  })

  const GAS_TARGET_PROXY = !process.env.SOLIDITY_COVERAGE ? 6e5 : 2e6
  it(`deploys DAO with proxies under ${GAS_TARGET_PROXY} gas`, async () => {
    await deployDAO(true, GAS_TARGET_PROXY)
  })
})
