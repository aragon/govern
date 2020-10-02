const { expect } = require("chai")

const EVENTS = {
  NEW: 'NewEaglet'
}

describe('EagletFactory', function () {
  let signers, owner, eagletFactory

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const OptimisticQueueFactory = await ethers.getContractFactory('OptimisticQueueFactory')
    const EagletFactory = await ethers.getContractFactory('EagletFactory')

    queueFactory = await OptimisticQueueFactory.deploy()
    eagletFactory = await EagletFactory.deploy(queueFactory.address)
  })

  const GAS_TARGET = !process.env.SOLIDITY_COVERAGE ? 4e6 : 20e6
  it(`deploys DAO under ${GAS_TARGET} gas`, async () => {
    const tx = eagletFactory.newDummyEaglet()
    await expect(tx)
      .to.emit(eagletFactory, EVENTS.NEW)

    const { hash } = await tx
    const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)

    expect(gasUsed).to.be.lte(GAS_TARGET)
  })
})
