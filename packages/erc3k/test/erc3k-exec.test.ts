import { ethers } from '@nomiclabs/buidler'
import { Erc3000ExecutorMock, Erc3000ExecutorMockFactory } from '../typechain'

describe('ERC3000 Executor', function () {
  let erc3kExec: Erc3000ExecutorMock

  beforeEach(async () => {
    const ERC3000Executor = (await ethers.getContractFactory(
      'ERC3000ExecutorMock'
    )) as Erc3000ExecutorMockFactory
    erc3kExec = await ERC3000Executor.deploy()
  })
})
