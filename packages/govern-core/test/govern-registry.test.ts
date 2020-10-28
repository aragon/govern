import { ethers } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { Signer } from 'ethers'
import {
  GovernRegistry,
  GovernRegistryFactory,
  Erc3000Mock,
  Erc3000MockFactory,
  Erc3000ExecutorMock,
  Erc3000ExecutorMockFactory,
  Erc3000BadInterfaceMockFactory,
  Erc3000ExecutorBadInterfaceMockFactory
} from '../typechain'

const ERRORS = {
  NAME_USED: 'registry: name used',
  BAD_INTERFACE_QUEUE: 'registry: bad interface queue',
  BAD_INTERFACE_DAO: 'registry: bad interface dao'
}

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata'
}

describe('GovernRegistry', function() {
  let governRegistry: GovernRegistry,
    erc3k: Erc3000Mock,
    erc3kExec: Erc3000ExecutorMock,
    signers: Signer[],
    current: string

  before(async () => {
    signers = await ethers.getSigners()
    current = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const ERC3000Mock = (await ethers.getContractFactory(
      'Erc3000Mock'
    )) as Erc3000MockFactory

    const ERC3000ExecutorMock = (await ethers.getContractFactory(
      'ERC3000ExecutorMock'
    )) as Erc3000ExecutorMockFactory

    const GovernRegistry = (await ethers.getContractFactory(
      'GovernRegistry'
    )) as GovernRegistryFactory

    erc3kExec = await ERC3000ExecutorMock.deploy()

    erc3k = await ERC3000Mock.deploy()

    governRegistry = await GovernRegistry.deploy()
    governRegistry = governRegistry.connect(signers[0])
  })

  it('calls register and is able the register the executor and queue', async () => {
    await expect(governRegistry.register(erc3kExec.address, erc3k.address, 'MyName', '0x00'))
      .to.emit(governRegistry, EVENTS.REGISTERED)
      .withArgs(erc3kExec.address, erc3k.address, current, 'MyName')
      .to.emit(governRegistry, EVENTS.SET_METADATA)
      .withArgs(erc3kExec.address, '0x00')

    expect(await governRegistry.nameUsed('MyName')).to.equal(true)
  })

  it('calls register and reverts cause the name is already used', async () => {
    governRegistry.register(erc3kExec.address, erc3k.address, 'MyName', '0x00')

    await expect(governRegistry.register(erc3kExec.address, erc3k.address, 'MyName', '0x00'))
      .to.be.revertedWith(ERRORS.NAME_USED)

    expect(await governRegistry.nameUsed('MyName')).to.equal(true)
  })

  it('calls register and reverts cause the queue has a wrong interface', async () => {
    const ERC3000BadInterfaceMock = (await ethers.getContractFactory(
      'ERC3000BadInterfaceMock'
    )) as Erc3000BadInterfaceMockFactory

    const erc3kBadInterface = await ERC3000BadInterfaceMock.deploy()

    await expect(governRegistry.register(erc3kExec.address, erc3kBadInterface.address, 'MyName', '0x00'))
      .to.be.revertedWith(ERRORS.BAD_INTERFACE_QUEUE)

    expect(await governRegistry.nameUsed('MyName')).to.equal(false)
  })

  it('calls register and reverts cause the dao has a wrong interface', async () => {
    const ERC3000ExecutorBadInterfaceMock = (await ethers.getContractFactory(
      'ERC3000ExecutorBadInterfaceMock'
    )) as Erc3000ExecutorBadInterfaceMockFactory

    const erc3kExecBadInterface = await ERC3000ExecutorBadInterfaceMock.deploy()

    await expect(governRegistry.register(erc3kExecBadInterface.address, erc3k.address, 'MyName', '0x00'))
      .to.be.revertedWith(ERRORS.BAD_INTERFACE_DAO)

    expect(await governRegistry.nameUsed('MyName')).to.equal(false)
  })
})
