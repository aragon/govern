import { expect } from 'chai'
import { Signer } from 'ethers'
import { hexDataSlice, id } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import {
  AdaptativeERC165Mock,
  AdaptativeERC165Mock__factory,
} from '../typechain'

const ERRORS = {
  UNKNOWN_CALLBACK: 'adap-erc165: unknown callback',
}

const EVENTS = {
  REGISTERED_CALLBACK: 'RegisteredCallback',
  REGISTERED_STANDARD: 'RegisteredStandard',
  RECEIVED_CALLBACK: 'ReceivedCallback',
}

const beefInterfaceId = '0xbeefbeef'
const callbackSig = hexDataSlice(id('callbackFunc()'), 0, 4) // 0x1eb2075a
const magicNumber = '0x10000000'

describe('AdaptativeErc165', function () {
  let adaptative: AdaptativeERC165Mock, signers: Signer[]

  before(async () => {
    signers = await ethers.getSigners()
    const Adaptative = (await ethers.getContractFactory(
      'AdaptativeERC165Mock'
    )) as AdaptativeERC165Mock__factory
    adaptative = await Adaptative.deploy()
  })

  context('registerStandardAndCallback', () => {
    it('ensures the right events were fired', async () => {
      await expect(
        adaptative.registerStandardAndCallback(
          beefInterfaceId,
          callbackSig,
          magicNumber
        )
      )
        .to.emit(adaptative, EVENTS.REGISTERED_STANDARD)
        .withArgs(beefInterfaceId)
        .to.emit(adaptative, EVENTS.REGISTERED_CALLBACK)
        .withArgs(callbackSig, magicNumber)
    })

    it('ensures support the right interfaceID', async () => {
      await expect(
        await adaptative.supportsInterface(beefInterfaceId)
      ).to.equal(true)
    })

    it('ensures the right callback was call with the right memory value', async () => {
      await expect(
        signers[0].sendTransaction({
          to: adaptative.address,
          data: callbackSig,
        })
      )
        .to.emit(adaptative, EVENTS.RECEIVED_CALLBACK)
        .withArgs(callbackSig, callbackSig)
    })

    it('reverts with unknown callback', async () => {
      await expect(
        signers[0].sendTransaction({
          to: adaptative.address,
          data: hexDataSlice(id('unknown()'), 0, 4),
        })
      ).to.be.revertedWith(ERRORS.UNKNOWN_CALLBACK)
    })
  })

  context('ERC-165', () => {
    const ERC165_INTERFACE_ID = '0x01ffc9a7'

    it('supports ERC-165', async () => {
      expect(await adaptative.supportsInterface(ERC165_INTERFACE_ID)).to.equal(
        true
      )
    })

    it("doesn't support random interfaceID", async () => {
      expect(await adaptative.supportsInterface('0xabababab')).to.equal(false)
    })
  })
})
