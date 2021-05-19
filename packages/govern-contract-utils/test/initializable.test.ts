import { expect } from 'chai'
import { ethers } from 'hardhat'
import { InitializableMock, InitializableMock__factory } from '../typechain'

// NOTE: We cannot assert on the values emitted
// in the events currently, see: https://github.com/EthWorks/Waffle/issues/87
describe('Initializable', function () {
  let init: InitializableMock

  beforeEach(async () => {
    const Initializable = (await ethers.getContractFactory(
      'InitializableMock'
    )) as InitializableMock__factory
    init = await Initializable.deploy()
  })

  it('ensures an init function can only be called once', async () => {
    await expect(init.initOne()).to.emit(init, 'Initialized')
    await expect(init.initOne()).to.be.revertedWith(
      'initializable: already initialized'
    )
  })

  it('locks functions based on init key', async () => {
    // Can both be called since they use different keys
    await expect(init.initOne()).to.emit(init, 'Initialized')
    await expect(init.initTwo()).to.emit(init, 'Initialized')

    // .. but can still only be called once
    await expect(init.initOne()).to.be.revertedWith(
      'initializable: already initialized'
    )
    await expect(init.initTwo()).to.be.revertedWith(
      'initializable: already initialized'
    )
  })
})
