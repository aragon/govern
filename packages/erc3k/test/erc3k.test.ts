import { ethers } from 'hardhat'
import { ERC3000Mock, ERC3000Mock__factory } from '../typechain'

describe('ERC3000', function () {
  let erc3k: ERC3000Mock

  beforeEach(async () => {
    const ERC3000 = (await ethers.getContractFactory(
      'ERC3000Mock'
    )) as ERC3000Mock__factory
    erc3k = await ERC3000.deploy()
  })
})
