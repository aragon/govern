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
    const EagletFactory = await ethers.getContractFactory('EagletFactory')
    eagletFactory = await EagletFactory.deploy()
  })

  it.only('creates system', async () => {
    await expect(eagletFactory.newDummyEaglet())
      .to.emit(eagletFactory, EVENTS.NEW)
  })
})
