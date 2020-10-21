const { expect } = require("chai");

describe('Govern Queue', function () {
  let oq, owner, notOwner, ownerAddr, notOwnerAddr

  const DELAY = 100

  beforeEach(async () => {
    [owner, notOwner] = await ethers.getSigners()
    ownerAddr = await owner.getAddress()
    notOwnerAddr = await notOwner.getAddress()

    const OQ = await ethers.getContractFactory('GovernQueue')
    oq = await OQ.deploy(ownerAddr, DELAY)
  })
})
