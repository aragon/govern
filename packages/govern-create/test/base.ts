import HRE, { waffle } from 'hardhat'
import { expect } from 'chai'
import {
  getEthersSignersAddresses,
  getGovernBaseFactory,
  getGovernRegistry,
} from '../helpers/helpers'
import { Address } from '../helpers/types'
import { GovernBaseFactory, GovernRegistry } from '../typechain'

const EVENTS = {
  REGISTERED: 'Registered',
  SET_METADATA: 'SetMetadata',
}

describe('Govern Base Factory', function () {
  let signers: Address[] = []
  let baseFactory: GovernBaseFactory, registry: GovernRegistry

  beforeEach(async () => {
    await HRE.run('dev-deploy')
    signers = <string[]>await getEthersSignersAddresses()
    registry = await getGovernRegistry()
    baseFactory = await getGovernBaseFactory()
  })

  const deployDAO = async (
    useProxies: boolean,
    gasTarget: number,
    deployToken = false
  ) => {
    const tx = baseFactory.newGovernWithoutConfig(
      'eagle',
      `0x${(deployToken ? '00' : '11').repeat(20)}`, // NOTE: zero addr deploys a token
      'Eaglet Token',
      'EAG',
      useProxies
    )

    await expect(tx).to.emit(registry, EVENTS.REGISTERED)
    await expect(tx).to.emit(registry, EVENTS.SET_METADATA)

    const { hash } = await tx
    const { gasUsed } = await waffle.provider.getTransactionReceipt(hash)

    expect(gasUsed).to.be.lte(gasTarget)

    console.log('gas used:', gasUsed.toNumber())
  }

  const GAS_TARGET = !process.env.SOLIDITY_COVERAGE ? 5.5e6 : 20e6
  it(`deploys DAO under ${GAS_TARGET} gas`, async () => {
    await deployDAO(false, GAS_TARGET)
  })

  const GAS_TARGET_PROXY = !process.env.SOLIDITY_COVERAGE ? 6e5 : 2e6
  it(`deploys DAO with proxies under ${GAS_TARGET_PROXY} gas`, async () => {
    await deployDAO(true, GAS_TARGET_PROXY)
  })

  // TODO: Implement tests
  it('deploys DAO with token')
})
