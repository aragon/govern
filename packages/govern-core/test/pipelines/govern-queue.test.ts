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

  it('calls schedule and returns with the expected result', () => {

  })

  it('calls schedule and errors with "queue: bad nonce"', () => {

  })

  it('calls schedule and errors with "queue: bad config"', () => {

  })

  it('calls schedule and errors with "queue: bad delay"', () => {

  })

  it('calls schedule and errors with "queue: bad submitter"', () => {

  })

  it('calls execute and returns with the expected result', () => {

  })

  it('calls execute and errors with "queue: wait more"', () => {

  })

  it('calls challenge and returns with the expected result', () => {

  })

  it('calls challenge and errors with "queue: bad fee pull"', () => {

  })

  it('calls challenge and errors with "queue: bad approve"', () => {

  })

  it('calls challenge and errors with "queue: bad reset"', () => {

  })

  it('calls resolve and returns with the expected result', () => {

  })

  it('calls resolve and errors with "queue: unresolved"', () => {

  })

  it('calls veto and runs as expected', () => {

  })

  it('calls configure and returns with the expected result', () => {

  })

  it('calls executeApprove and returns with the expected result', () => {

  })

  it('calls settleRejection and returns with the expected result', () => {

  })

  it('calls rule and returns with the expected result', () => {

  })

  it('calls submitEvidence and reverts as expected', () => {

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
