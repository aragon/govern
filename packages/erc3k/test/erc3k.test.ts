import { ethers } from '@nomiclabs/buidler'
import {
  Erc3000Mock,
  Erc3000Mock__factory as Erc3000MockFactory,
} from '../typechain'

describe('ERC3000', function () {
  let erc3k: Erc3000Mock

  beforeEach(async () => {
    const ERC3000 = (await ethers.getContractFactory(
      'ERC3000Mock'
    )) as Erc3000MockFactory
    erc3k = await ERC3000.deploy()
  })
})
