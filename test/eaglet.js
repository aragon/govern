const { expect } = require("chai");

describe('Eaglet', function () {
  let owner, notOwner

  beforeEach(async () => {
    [owner, notOwner] = await ethers.getSigners()
    const Eaglet = await ethers.getContractFactory('Eaglet')
    eaglet = await Eaglet.deploy(owner)
  })

  it('owner can exec', async () => {
    // await eaglet.exec([], { from: owner })
  })

  it('non-owner can exec', async () => {
    // await eaglet.execute([], { from: notOwner })
  })
})
