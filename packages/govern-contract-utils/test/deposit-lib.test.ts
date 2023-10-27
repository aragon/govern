import { expect } from 'chai'
import { ethers } from 'hardhat'

import {
  DepositLibMock,
  DepositLibMock__factory,
  GoodToken,
  GoodToken__factory,
} from '../typechain'

const EVENTS = {
  LOCKED: 'Locked',
  UNLOCKED: 'Unlocked',
  TRANSFER: 'Transfer',
}

const ERRORS = {
  BAD_TOKEN_LOCK: 'deposit: bad token lock',
  BAD_TOKEN_RELEASE: 'deposit: bad token release',
}

const amount = 1000

describe('DepositLib', function () {
  let depositLibMock: DepositLibMock, goodToken: GoodToken, owner: any

  before(async () => {
    const DepositLibMockFactory = (await ethers.getContractFactory(
      'DepositLibMock'
    )) as unknown as DepositLibMock__factory
    depositLibMock = await DepositLibMockFactory.deploy()

    owner = await (await ethers.getSigners())[0].getAddress()
  })

  describe('collectFrom', async () => {
    before(async () => {
      const GoodTokenFactory = (await ethers.getContractFactory(
        'GoodToken'
      )) as unknown as GoodToken__factory
      goodToken = await GoodTokenFactory.deploy()
    })

    it('reverts if the token in the collateral is not a contract', async () => {
      const deposit = {
        token: owner,
        amount: amount,
      }
      await expect(
        depositLibMock.collectFrom(deposit, owner)
      ).to.be.revertedWith(ERRORS.BAD_TOKEN_LOCK)
    })

    it("reverts if the token's `from` address doesn't have approval for `to` address", async () => {
      const deposit = {
        token: goodToken.address,
        amount: amount,
      }

      await expect(
        depositLibMock.collectFrom(deposit, owner)
      ).to.be.revertedWith(ERRORS.BAD_TOKEN_LOCK)
    })

    it('successfully makes the transfer and emits the events', async () => {
      const deposit = {
        token: goodToken.address,
        amount: amount,
      }

      await goodToken.setBalanceTo(owner, amount)

      let tx = await depositLibMock.collectFrom(deposit, owner)

      await expect(tx)
        .to.emit(goodToken, EVENTS.TRANSFER)
        .withArgs(owner, depositLibMock.address, amount)
        .to.emit(depositLibMock, EVENTS.LOCKED)
        .withArgs(goodToken.address, owner, amount)
    })
  })

  describe('releaseTo', async () => {
    before(async () => {
      const GoodTokenFactory = (await ethers.getContractFactory(
        'GoodToken'
      )) as unknown as GoodToken__factory
      goodToken = await GoodTokenFactory.deploy()
    })

    it('reverts if the token in the collateral is not a contract', async () => {
      const deposit = {
        token: owner,
        amount: amount,
      }
      await expect(depositLibMock.releaseTo(deposit, owner)).to.be.revertedWith(
        ERRORS.BAD_TOKEN_RELEASE
      )
    })

    it("reverts if the contract doesn't have enough balance to make the transfer", async () => {
      const deposit = {
        token: goodToken.address,
        amount: amount,
      }

      await expect(depositLibMock.releaseTo(deposit, owner)).to.be.revertedWith(
        ERRORS.BAD_TOKEN_RELEASE
      )
    })

    it('successfully makes the transfer and emits the events', async () => {
      const deposit = {
        token: goodToken.address,
        amount: amount,
      }

      await goodToken.setBalanceTo(depositLibMock.address, amount)

      let tx = depositLibMock.releaseTo(deposit, owner)

      // TODO: the chaining turns out to be wrong. if the first withArgs fail, and the second withArgs doesn't fail,
      // the below throws unhandledPromiseRejection and says that they are not equal, but doesn't make the tests fail.
      await expect(tx)
        .to.emit(goodToken, EVENTS.TRANSFER)
        .withArgs(depositLibMock.address, owner, amount)
        .to.emit(depositLibMock, EVENTS.UNLOCKED)
        .withArgs(goodToken.address, owner, amount)
    })
  })
})
