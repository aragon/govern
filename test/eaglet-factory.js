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

  it.only('creates system', async () => {
    await expect(eagletFactory.newDummyEaglet())
      .to.emit(eagletFactory, EVENTS.NEW)
  })
})
