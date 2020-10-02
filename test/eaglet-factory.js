const { expect } = require("chai")

const EVENTS = {
  NEW: 'NewEaglet',
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata'
}

describe('EagletFactory', function () {
  let signers, owner, eagletFactory, ERC3000Registry

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const OptimisticQueueFactory = await ethers.getContractFactory('OptimisticQueueFactory')
    const ERC3000Registry = await ethers.getContractFactory('ERC3000Registry')
    const EagletFactory = await ethers.getContractFactory('EagletFactory')

    queueFactory = await OptimisticQueueFactory.deploy()
    ERC3000Registry = await ERC3000Registry.deploy()
    eagletFactory = await EagletFactory.deploy(queueFactory.address, ERC3000Registry.address)
  })

  const GAS_TARGET = !process.env.SOLIDITY_COVERAGE ? 4e6 : 20e6
  it(`deploys DAO under ${GAS_TARGET} gas`, async () => {
    const tx = eagletFactory.newDummyEaglet('eagle')

    await expect(tx).to.emit(eagletFactory, EVENTS.NEW)
    await expect(tx).to.emit(ERC3000Registry, EVENTS.REGISTERED)
    await expect(tx).to.emit(ERC3000Registry, EVENTS.SET_METADATA)

    const { hash } = await tx
    const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)

    expect(gasUsed).to.be.lte(GAS_TARGET)

    console.log('gas used:', gasUsed.toNumber())
  })
})
