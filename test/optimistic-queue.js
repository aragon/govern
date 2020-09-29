const { expect } = require("chai");

describe('Optimistic Queue', function () {
  let oq, owner, notOwner, ownerAddr, notOwnerAddr

  const DELAY = 100

  beforeEach(async () => {
    [owner, notOwner] = await ethers.getSigners()
    ownerAddr = await owner.getAddress()
    notOwnerAddr = await notOwner.getAddress()

    const OQ = await ethers.getContractFactory('OptimisticQueue')
    oq = await OQ.deploy(ownerAddr, DELAY)
  })
})
