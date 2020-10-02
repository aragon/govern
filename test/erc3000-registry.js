const { expect } = require("chai")

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata'
}

describe('ERC3000 Registry', function () {
  let signers, owner, eagletFactory, registry

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const OptimisticQueueFactory = await ethers.getContractFactory('OptimisticQueueFactory')
    const ERC3000Registry = await ethers.getContractFactory('ERC3000Registry')
    const EagletFactory = await ethers.getContractFactory('EagletFactory')

    queueFactory = await OptimisticQueueFactory.deploy()
    registry = await ERC3000Registry.deploy()
    eagletFactory = await EagletFactory.deploy(registry.address, queueFactory.address)
  })

  const GAS_TARGET = !process.env.SOLIDITY_COVERAGE ? 4e6 : 20e6
  it(`deploys DAO under ${GAS_TARGET} gas`, async () => {
    const tx = eagletFactory.newDummyEaglet('eagle')

    await expect(tx).to.emit(registry, EVENTS.REGISTERED)
    await expect(tx).to.emit(registry, EVENTS.SET_METADATA)

    const { gasUsed } = await tx.wait()
    expect(gasUsed).to.be.lte(GAS_TARGET)

    console.log('gas used:', gasUsed.toNumber())
  })
})
