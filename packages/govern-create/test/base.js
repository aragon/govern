const { expect } = require("chai")

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata'
}

describe('ERC3000 Registry', function () {
  let signers, owner, governBaseFactory, registry

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const GovernQueueFactory = await ethers.getContractFactory('GovernQueueFactory')
    const ERC3000Registry = await ethers.getContractFactory('ERC3000Registry')
    const GovernBaseFactory = await ethers.getContractFactory('GovernBaseFactory')

    queueFactory = await GovernQueueFactory.deploy()
    registry = await ERC3000Registry.deploy()
    governBaseFactory = await GovernBaseFactory.deploy(registry.address, queueFactory.address)
  })

  const GAS_TARGET = !process.env.SOLIDITY_COVERAGE ? 4e6 : 20e6
  it(`deploys DAO under ${GAS_TARGET} gas`, async () => {
    const tx = governBaseFactory.newDummyGovern('eagle')

    await expect(tx).to.emit(registry, EVENTS.REGISTERED)
    await expect(tx).to.emit(registry, EVENTS.SET_METADATA)

    const { hash } = await tx
    const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)

    expect(gasUsed).to.be.lte(GAS_TARGET)

    console.log('gas used:', gasUsed.toNumber())
  })
})
