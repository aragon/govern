import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Signer } from 'ethers'
import { GovernQueue, GovernQueue__factory } from '../../typechain'

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
    )) as GovernQueue__factory
    gq = (await GQ.deploy(ownerAddr, INIT_CONFIG)) as GovernQueue
  })

  context('ERC-165', () => {
    const ERC165_INTERFACE_ID = '0x01ffc9a7'
    const ERC3000_INTERFACE_ID = '0x8663a648'
    it('supports ERC-165', async () => {
      expect(await gq.supportsInterface(ERC165_INTERFACE_ID)).to.equal(true)
    })

    it('supports ERC-3000', async () => {
      expect(await gq.supportsInterface(ERC3000_INTERFACE_ID)).to.equal(true)
    })

    it("doesn't support random interfaceID", async () => {
      expect(await gq.supportsInterface('0xabababab')).to.equal(false)
    })
  })
})
