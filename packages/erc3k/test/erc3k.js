const { expect } = require('chai')

describe('ERC3000', function() {
  let erc3k

  beforeEach(async () => {
    const ERC3000 = await ethers.getContractFactory('ERC3000Mock')
    erc3k = await ERC3000.deploy()
  })

  context('ERC-165', () => {
    const ERC165_INTERFACE_ID = '0x01ffc9a7'

    it('supports ERC-165', async () => {
      expect(await erc3k.supportsInterface(ERC165_INTERFACE_ID)).to.equal(true)
    })

    it('supports ERC-3000', async () => {
      expect(await erc3k.supportsInterface(await erc3k.interfaceID())).to.equal(true)
    })

    it("doesn't support random interfaceID", async () => {
      expect(await erc3k.supportsInterface('0xabababab')).to.equal(false)
    })
  })
})
