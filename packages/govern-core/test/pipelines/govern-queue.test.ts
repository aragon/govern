import { ethers } from '@nomiclabs/buidler'
import { Signer } from 'ethers'
import { GovernQueue, GovernQueueFactory } from '../../typechain'

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

describe('Govern Queue', function () {
  let accounts: Signer[], owner: Signer, ownerAddr
  let gq: GovernQueue

  const INIT_CONFIG = {
    executionDelay: 0,
    scheduleDeposit: {
      token: ZERO_ADDR,
      amount: 0,
    },
    challengeDeposit: {
      token: ZERO_ADDR,
      amount: 0,
    },
    vetoDeposit: {
      token: ZERO_ADDR,
      amount: 0,
    },
    resolver: ZERO_ADDR,
    rules: '0x',
  }

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    owner = accounts[0]
    ownerAddr = await owner.getAddress()

    const GQ = (await ethers.getContractFactory(
      'GovernQueue'
    )) as GovernQueueFactory
    gq = await GQ.deploy(ownerAddr, INIT_CONFIG)
  })
})
