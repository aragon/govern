import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
  SafeERC20Mock,
  SafeERC20Mock__factory,
  GoodToken,
  GoodToken__factory,
  BadToken,
  BadToken__factory,
  WorstToken,
  WorstToken__factory,
} from '../typechain'

const balanceAmount = 10000

const EVENTS = {
  Transfer: 'Transfer',
  TransferFrom: 'TransferFrom',
  Approve: 'Approve',
}
const ERRORS = {
  SAFE_TRANSFER: 'SAFE_TRANSFER: Fail',
  SAFE_TRANSFER_FROM: 'SAFE_TRANSFER_FROM: Fail',
}

describe('SafeERC20', function () {
  let safeERC20: SafeERC20Mock

  let badToken: BadToken
  let goodToken: GoodToken
  let worstToken: WorstToken

  let owner: any

  beforeEach(async () => {
    const safeERCMock = (await ethers.getContractFactory(
      'SafeERC20Mock'
    )) as SafeERC20Mock__factory
    safeERC20 = await safeERCMock.deploy()

    const BadToken = (await ethers.getContractFactory(
      'BadToken'
    )) as BadToken__factory
    badToken = await BadToken.deploy()
    badToken.setBalanceTo(safeERC20.address, balanceAmount)

    const GoodToken = (await ethers.getContractFactory(
      'GoodToken'
    )) as GoodToken__factory
    goodToken = await GoodToken.deploy()
    goodToken.setBalanceTo(safeERC20.address, balanceAmount)

    const WorstToken = (await ethers.getContractFactory(
      'WorstToken'
    )) as WorstToken__factory
    worstToken = await WorstToken.deploy()
    worstToken.setBalanceTo(safeERC20.address, balanceAmount)

    owner = await (await ethers.getSigners())[0].getAddress()
  })

  it('reverts if the token address is a EOA', async () => {
    await expect(
      safeERC20.safeTransfer(owner, balanceAmount)
    ).to.be.revertedWith(ERRORS.SAFE_TRANSFER)
  })

  describe('Safe Transfer', () => {
    it('succeeds when the amount is not too big', async () => {
      await expect(
        safeERC20.safeTransfer(goodToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Transfer)
      await expect(
        safeERC20.safeTransfer(badToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Transfer)
      await expect(
        safeERC20.safeTransfer(worstToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Transfer)
    })

    it('reverts when amount is too big', async () => {
      await expect(
        safeERC20.safeTransfer(goodToken.address, balanceAmount + 1)
      ).to.be.revertedWith(ERRORS.SAFE_TRANSFER)
      await expect(
        safeERC20.safeTransfer(badToken.address, balanceAmount + 1)
      ).to.be.revertedWith(ERRORS.SAFE_TRANSFER)
      await expect(
        safeERC20.safeTransfer(worstToken.address, balanceAmount + 1)
      ).to.be.revertedWith(ERRORS.SAFE_TRANSFER)
    })
  })

  describe('Safe Transfer From', () => {
    it('succeeds when the amount is not too big', async () => {
      await expect(
        safeERC20.safeTransferFrom(goodToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Transfer)
      await expect(
        safeERC20.safeTransferFrom(badToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Transfer)
      await expect(
        safeERC20.safeTransferFrom(worstToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Transfer)
    })

    it('reverts when amount is too big', async () => {
      await expect(
        safeERC20.safeTransferFrom(goodToken.address, balanceAmount + 1)
      ).to.be.revertedWith(ERRORS.SAFE_TRANSFER_FROM)
      await expect(
        safeERC20.safeTransferFrom(badToken.address, balanceAmount + 1)
      ).to.be.revertedWith(ERRORS.SAFE_TRANSFER_FROM)
      await expect(
        safeERC20.safeTransferFrom(worstToken.address, balanceAmount + 1)
      ).to.be.revertedWith(ERRORS.SAFE_TRANSFER_FROM)
    })
  })

  describe('Safe Approve', () => {
    it('succeeds in all cases for all types of tokens', async () => {
      await expect(
        safeERC20.safeApprove(goodToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Approve)
      await expect(
        safeERC20.safeApprove(badToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Approve)
      await expect(
        safeERC20.safeApprove(worstToken.address, balanceAmount)
      ).to.emit(safeERC20, EVENTS.Approve)
    })
  })
})
