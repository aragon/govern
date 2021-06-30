import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Signer } from 'ethers'
import {
  GovernRegistry,
  GovernRegistry__factory,
  ERC3000Mock,
  ERC3000Mock__factory,
  ERC3000ExecutorMock,
  ERC3000ExecutorMock__factory,
} from '../typechain'

const ERRORS = {
  NAME_USED: 'registry: name used',
}

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata',
}

const NO_TOKEN = `0x${'00'.repeat(20)}`

describe('GovernRegistry', function () {
  let governRegistry: GovernRegistry,
    erc3k: ERC3000Mock,
    erc3kExec: ERC3000ExecutorMock,
    signers: Signer[],
    current: string

  before(async () => {
    signers = await ethers.getSigners()
    current = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const ERC3000Mock = (await ethers.getContractFactory(
      'ERC3000Mock'
    )) as ERC3000Mock__factory

    const ERC3000ExecutorMock = (await ethers.getContractFactory(
      'ERC3000ExecutorMock'
    )) as ERC3000ExecutorMock__factory

    const GovernRegistry = (await ethers.getContractFactory(
      'GovernRegistry'
    )) as GovernRegistry__factory

    erc3kExec = await ERC3000ExecutorMock.deploy()

    erc3k = await ERC3000Mock.deploy()

    governRegistry = await GovernRegistry.deploy()
    governRegistry = governRegistry.connect(signers[0])
  })

  it('calls register and is able to register the executor and queue', async () => {
    await expect(
      governRegistry.register(
        erc3kExec.address,
        erc3k.address,
        NO_TOKEN,
        NO_TOKEN,
        'MyName',
        '0x00'
      )
    )
      .to.emit(governRegistry, EVENTS.REGISTERED)
      .withArgs(erc3kExec.address, erc3k.address, NO_TOKEN, NO_TOKEN, current, 'MyName')
      .to.emit(governRegistry, EVENTS.SET_METADATA)
      .withArgs(erc3kExec.address, '0x00')

    expect(await governRegistry.nameUsed('MyName')).to.equal(true)
  })

  it('calls register and reverts cause the name is already used', async () => {
    governRegistry.register(
      erc3kExec.address,
      erc3k.address,
      `0x${'00'.repeat(20)}`,
      `0x${'00'.repeat(20)}`,
      'MyName',
      '0x00'
    )

    await expect(
      governRegistry.register(
        erc3kExec.address,
        erc3k.address,
        `0x${'00'.repeat(20)}`,
        `0x${'00'.repeat(20)}`,
        'MyName',
        '0x00'
      )
    ).to.be.revertedWith(ERRORS.NAME_USED)

    expect(await governRegistry.nameUsed('MyName')).to.equal(true)
  })
})
