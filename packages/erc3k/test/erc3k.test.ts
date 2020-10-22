import { ethers } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { Erc3000Mock, Erc3000MockFactory } from '../typechain'

describe('ERC3000', function () {
  let erc3k: Erc3000Mock

  beforeEach(async () => {
    const ERC3000 = (await ethers.getContractFactory(
      'ERC3000Mock'
    )) as Erc3000MockFactory
    erc3k = await ERC3000.deploy()
  })

  context('ERC-165', () => {
    const ERC165_INTERFACE_ID = '0x01ffc9a7'

    it('supports ERC-165', async () => {
      expect(await erc3k.supportsInterface(ERC165_INTERFACE_ID)).to.equal(true)
    })

    it('supports ERC-3000', async () => {
      expect(await erc3k.supportsInterface(await erc3k.interfaceID())).to.equal(
        true
      )
    })

    it("doesn't support random interfaceID", async () => {
      expect(await erc3k.supportsInterface('0xabababab')).to.equal(false)
    })
  })
})
