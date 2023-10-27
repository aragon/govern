import { ethers } from 'hardhat'
import { ERC3000ExecutorMock, ERC3000ExecutorMock__factory } from '../typechain'

describe('ERC3000 Executor', function () {
  let erc3kExec: ERC3000ExecutorMock

  beforeEach(async () => {
    const ERC3000Executor = (await ethers.getContractFactory(
      'ERC3000ExecutorMock'
    )) as unknown as ERC3000ExecutorMock__factory
    erc3kExec = await ERC3000Executor.deploy()
  })
})
