import { ethers } from '@nomiclabs/buidler'
import { Signer } from 'ethers'
import { GovernQueue, GovernQueueFactory } from '../../typechain'

describe('Govern Queue', function () {
  let owner: Signer, notOwner: Signer, ownerAddr, notOwnerAddr
  let gq: GovernQueue

  // TODO: add initial configuration
  const INIT_CONFIG: any = {}

  beforeEach(async () => {
    ;[owner, notOwner] = await ethers.getSigners()
    ownerAddr = await owner.getAddress()
    notOwnerAddr = await notOwner.getAddress()

    const GQ = (await ethers.getContractFactory(
      'GovernQueue'
    )) as GovernQueueFactory
    gq = await GQ.deploy(ownerAddr, INIT_CONFIG)
  })
})
