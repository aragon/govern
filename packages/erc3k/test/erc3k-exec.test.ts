import { ethers } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { ERC3000Executor } from '../typechain'

describe('ERC3000 Executor', function () {
  let erc3kExec: ERC3000Executor

  beforeEach(async () => {
    const ERC3000Executor = await ethers.getContractFactory(
      'ERC3000ExecutorMock'
    )
    erc3kExec = await ERC3000Executor.deploy()
  })

  context('ERC-165', () => {
    const ERC165_INTERFACE_ID = '0x01ffc9a7'

    it('supports ERC-165', async () => {
      expect(await erc3kExec.supportsInterface(ERC165_INTERFACE_ID)).to.equal(
        true
      )
    })

    it('supports ERC-3000 Executor', async () => {
      expect(
        await erc3kExec.supportsInterface(await erc3kExec.interfaceID())
      ).to.equal(true)
    })

    it("doesn't support random interfaceID", async () => {
      expect(await erc3kExec.supportsInterface('0xabababab')).to.equal(false)
    })
  })
})
