import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Signer } from 'ethers'
import { hexDataSlice, id } from 'ethers/lib/utils'
import { Govern } from '../typechain'

const ERRORS = {
  AUTH: 'acl: auth',
}

const EVENTS = {
  EXECUTED: 'Executed',
  ETH_DEPOSITED: 'ETHDeposited',
  REGISTERED_CALLBACK: 'RegisteredCallback',
  REGISTERED_STANDARD: 'RegisteredStandard',
  RECEIVED_CALLBACK: 'ReceivedCallback',
}

const B32_ZERO = `0x${'00'.repeat(32)}`

describe('Govern', function () {
  let signers: Signer[], owner: string, govern: Govern, governNotOwner: Govern

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const Govern = await ethers.getContractFactory('Govern')
    govern = (await Govern.deploy(owner)) as unknown as Govern
    governNotOwner = await govern.connect(signers[1])
  })

  it('owner can exec', async () => {
    await expect(govern.exec([], B32_ZERO, B32_ZERO))
      .to.emit(govern, EVENTS.EXECUTED)
      .withArgs(owner, [], B32_ZERO, B32_ZERO, [])
  })

  it('non-owner cannot exec', async () => {
    await expect(
      governNotOwner.exec([], B32_ZERO, B32_ZERO)
    ).to.be.revertedWith(ERRORS.AUTH)
  })

  // TODO: Giorgi Fix
  // it('emits the ETHDeposited event as expected', async () => {
  //   await expect(
  //     signers[0].sendTransaction({
  //       value: 1000,
  //       to: govern.address,
  //     })
  //   )
  //     .to.emit(govern, EVENTS.ETH_DEPOSITED)
  //     .withArgs(owner, 1000)
  // })

  it('registers a standard and calls fallback as expected', async () => {
    const magicNumber = '0x10000000'
    const callbackSig = hexDataSlice(id('callbackFunc()'), 0, 4)

    const calldata = govern.interface.encodeFunctionData(
      'registerStandardAndCallback',
      [callbackSig, callbackSig, magicNumber]
    )

    const action = {
      to: govern.address,
      value: 0,
      data: calldata,
    }

    await expect(govern.exec([action], B32_ZERO, B32_ZERO))
      .to.emit(govern, EVENTS.REGISTERED_STANDARD)
      .withArgs(callbackSig)
      .to.emit(govern, EVENTS.REGISTERED_CALLBACK)
      .withArgs(callbackSig, magicNumber)

    await expect(
      signers[0].sendTransaction({
        to: govern.address,
        data: callbackSig,
      })
    )
      .to.emit(govern, EVENTS.RECEIVED_CALLBACK)
      .withArgs(callbackSig, callbackSig)
  })

  context('ERC-165', () => {
    const ERC165_INTERFACE_ID = '0x01ffc9a7'
    const ERC3000_EXEC_INTERFACE_ID = '0xc2d85afc'

    it('supports ERC-165', async () => {
      expect(await govern.supportsInterface(ERC165_INTERFACE_ID)).to.equal(true)
    })

    it('supports ERC-3000 exec', async () => {
      expect(
        await govern.supportsInterface(ERC3000_EXEC_INTERFACE_ID)
      ).to.equal(true)
    })

    it("doesn't support random interfaceID", async () => {
      expect(await govern.supportsInterface('0xabababab')).to.equal(false)
    })
  })
})
