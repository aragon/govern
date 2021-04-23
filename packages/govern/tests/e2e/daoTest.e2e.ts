import { configure, dao, daos } from '@aragon/govern'
import { subgraphURL } from './config'
import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'


/**
 * dao e2e test
 */
describe('[e2e] dao Test', () => {
  beforeEach(() => {
    configure({ subgraphURL })
  })

  it('calls dao and returns as expected', async () => {
    const daoList = await daos()

    const daoWithContainer = daoList.find(d => d.queue.containers.length > 0)

    // fail the test if there is no dao with a container so we can manually
    // add a dao for the testing.  This should rarely happen because registry
    // creation add a dummy doa by default in rinkeby
    expect(daoWithContainer).toBeDefined()

    const { name } = daoWithContainer!

    expect(name).toBeDefined()

    const rawResponse = await dao(name)

    expect(rawResponse).not.toBeNull()

    const response = rawResponse!

    expect(response.id).toEqual(name)

    expect(response.name).toEqual(name)

    expect(response.queue.id).toBeDefined()

    expect(isAddress(response.queue.address)).toEqual(true)

    expect(BigNumber.from(response.queue.nonce).gte(0)).toEqual(true)

    expect(response.queue.config.executionDelay).toBeDefined()

    expect(response.queue.config.scheduleDeposit).toBeDefined()

    expect(response.queue.config.challengeDeposit).toBeDefined()

    expect(response.queue.config.resolver).toBeDefined()

    expect(response.queue.config.rules).toBeDefined()

    expect(Array.isArray(response.queue.containers)).toEqual(true)
    const container = response.queue.containers[0]
    expect(container).toBeDefined()
    expect(container).toHaveProperty('id')
    expect(container).toHaveProperty('state')
    expect(container).toHaveProperty('config')
    expect(container).toHaveProperty('payload')
    expect(isAddress(container.payload.executor.address)).toEqual(true)
    expect(isAddress(container.payload.submitter)).toEqual(true)
    expect(Array.isArray(container.payload.actions)).toEqual(true)
    expect(container.payload.actions[0]).toHaveProperty('id')
    expect(isAddress(container.payload.actions[0].to)).toEqual(true)
    expect(container.payload.actions[0]).toHaveProperty('value')
    expect(container.payload.actions[0]).toHaveProperty('data')
    expect(container.payload).toHaveProperty('allowFailuresMap')
    expect(container.payload).toHaveProperty('proof')
    expect(Array.isArray(container.history)).toEqual(true)

    expect(response.executor.address).toBeDefined()

    expect(isAddress(response.executor.address)).toEqual(true)

    expect(response.executor.metadata).toBeDefined()

    expect(response.executor.balance).toBeDefined()

    expect(response.executor.roles[0]).toBeDefined()

    expect(isAddress(response.token)).toEqual(true)
    expect(isAddress(response.registrant)).toEqual(true)

  })

  it('non-existent dao should return null', async () => {
    const name = "non-existent"

    const response = await dao(name)

    expect(response).toBeNull()
  })

})

