import { ethers } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { Signer } from 'ethers'
import { GovernQueue, GovernQueueFactory } from '../../typechain'

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

describe('Govern Queue', function() {
  let accounts: Signer[], owner: Signer, ownerAddr
  let gq: GovernQueue

  const INIT_CONFIG = {
    executionDelay: 0,
    scheduleDeposit: {
      token: ZERO_ADDR,
      amount: 0
    },
    challengeDeposit: {
      token: ZERO_ADDR,
      amount: 0
    },
    vetoDeposit: {
      token: ZERO_ADDR,
      amount: 0
    },
    resolver: ZERO_ADDR,
    rules: '0x'
  }

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    owner = accounts[0]
    ownerAddr = await owner.getAddress()

    const GQ = (await ethers.getContractFactory(
      'GovernQueue'
    )) as GovernQueueFactory
    gq = (await GQ.deploy(ownerAddr, INIT_CONFIG)) as GovernQueue
  })

  context('GovernQueue.schedule', () => {
    it('returns with the expected result', () => {

    })

    it('errors with "queue: bad nonce"', () => {

    })

    it('errors with "queue: bad config"', () => {

    })

    it('errors with "queue: bad delay"', () => {

    })

    it('errors with "queue: bad submitter"', () => {

    })
  })

  context('GovernQueue.execute', () => {
    it('returns with the expected result', () => {

    })

    it('errors with "queue: wait more"', () => {

    })
  })

  context('GovernQueue.challenge', () => {
    it('returns with the expected result', () => {

    })

    it('errors with "queue: bad fee pull"', () => {

    })

    it('errors with "queue: bad approve"', () => {

    })

    it('errors with "queue: bad reset"', () => {

    })
  })

  context('GovernQueue.resolve', () => {
    it('returns with the expected result', () => {

    })

    it('errors with "queue: unresolved"', () => {

    })
  })

  context('GovernQueue.veto', () => {
    it('runs as expected', () => {

    })
  })

  context('GovernQueue.configure', () => {
    it('returns with the expected result', () => {

    })
  })

  context('GovernQueue.executeApprove', () => {
    it('returns with the expected result', () => {

    })
  })

  context('GovernQueue.settleRejection', () => {
    it('returns with the expected result', () => {

    })
  })

  context('GovernQueue.rule', () => {
    it('returns with the expected result', () => {

    })
  })

  context('GovernQueue.submitEvidence', () => {
    it('reverts as expected', () => {

    })
  })

  context('ERC-165', () => {
    const ERC165_INTERFACE_ID = '0x01ffc9a7'
    const ERC3000_INTERFACE_ID = '0x45f1d4aa'
    it('supports ERC-165', async () => {
      expect(await gq.supportsInterface(ERC165_INTERFACE_ID)).to.equal(true)
    })

    it('supports ERC-3000', async () => {
      expect(await gq.supportsInterface(ERC3000_INTERFACE_ID)).to.equal(true)
    })

    it('doesn\'t support random interfaceID', async () => {
      expect(await gq.supportsInterface('0xabababab')).to.equal(false)
    })
  })
})
