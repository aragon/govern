import { ethers } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { Signer } from 'ethers'
import {
  Erc3000Registry,
  Erc3000RegistryFactory,
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

describe('ERC3000 Registry', function() {
  let erc3kRegistry: Erc3000Registry,
    erc3k: Erc3000Mock,
    erc3kExec: Erc3000ExecutorMock,
    signers: Signer[],
    current: string

  before(async () => {
    signers = await ethers.getSigners()
    current = await signers[0].getAddress()
  })

  beforeEach(async () => {
    const Erc3000Mock = (await ethers.getContractFactory(
      'Erc3000Mock'
    )) as Erc3000MockFactory

    const ERC3000Executor = (await ethers.getContractFactory(
      'ERC3000ExecutorMock'
    )) as Erc3000ExecutorMockFactory

    const ERC3000Registry = (await ethers.getContractFactory(
      'ERC3000Registry'
    )) as Erc3000RegistryFactory

    erc3kExec = await ERC3000Executor.deploy()

    erc3k = await Erc3000Mock.deploy()

    erc3kRegistry = await ERC3000Registry.deploy()
    erc3kRegistry = erc3kRegistry.connect(signers[0])
  })

  it('calls register and is able the register the executor and queue', async () => {
    await expect(erc3kRegistry.register(erc3kExec.address, erc3k.address, 'MyName', '0x00'))
      .to.emit(erc3kRegistry, EVENTS.REGISTERED)
      .withArgs(erc3kExec.address, erc3k.address, current, 'MyName')
      .to.emit(erc3kRegistry, EVENTS.SET_METADATA)
      .withArgs(erc3kExec.address, '0x00')
  })

  it('calls register and reverts cause the name is already used', async () => {
    erc3kRegistry.register(erc3kExec.address, erc3k.address, 'MyName', '0x00')

    await expect(erc3kRegistry.register(erc3kExec.address, erc3k.address, 'MyName', '0x00'))
      .to.be.revertedWith(ERRORS.NAME_USED)
  })

  it('calls register and reverts cause the queue has a wrong interface', async () => {
    const ERC3000BadInterfaceMock = (await ethers.getContractFactory(
      'ERC3000BadInterfaceMock'
    )) as Erc3000BadInterfaceMockFactory

    const erc3kBadInterface = await ERC3000BadInterfaceMock.deploy()

    await expect(erc3kRegistry.register(erc3kExec.address, erc3kBadInterface.address, 'MyName', '0x00'))
      .to.be.revertedWith(ERRORS.BAD_INTERFACE_QUEUE)
  })

  it('calls register and reverts cause the dao has a wrong interface', async () => {
    const ERC3000ExecutorBadInterfaceMock = (await ethers.getContractFactory(
      'ERC3000ExecutorBadInterfaceMock'
    )) as Erc3000ExecutorBadInterfaceMockFactory

    const erc3kExecBadInterface = await ERC3000ExecutorBadInterfaceMock.deploy()

    await expect(erc3kRegistry.register(erc3kExecBadInterface.address, erc3k.address, 'MyName', '0x00'))
      .to.be.revertedWith(ERRORS.BAD_INTERFACE_DAO)
  })
})
