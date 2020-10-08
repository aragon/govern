const { expect } = require("chai")

const ERRORS = {
  AUTH: 'acl: auth'
}

const EVENTS = {
  EXECUTED: 'Executed'
}

describe('Eaglet', function () {
  let signers, owner, eaglet, eagletNotOwner

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const Eaglet = await ethers.getContractFactory('Eaglet')
    eaglet = await Eaglet.deploy(owner)
    eagletNotOwner = await eaglet.connect(signers[1])
  })

  it('owner can exec', async () => {
    await expect(eaglet.exec([]))
      .to.emit(eaglet, EVENTS.EXECUTED)
      .withArgs(owner, [], [])
  })

  it('non-owner cannot exec', async () => {
    await expect(eagletNotOwner.exec([])).to.be.revertedWith(ERRORS.AUTH)
  })
})
