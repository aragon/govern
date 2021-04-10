import { configure, dao } from '@aragon/govern'
import { subgraphURL } from './config'
import * as daosData from '../fixtures/daos-data.json'

/**
 * dao e2e test
 */
describe('[e2e] dao Test', () => {
  beforeEach(() => {
    configure({ subgraphURL })
  })

  it('calls dao and returns as expected', async () => {
    const expected = daosData[0]
    const name = "GIORGI-DAO3"

    const rawResponse = await dao(name)

    expect(rawResponse).not.toBeNull()

    const response = rawResponse!

    expect(response.id).toEqual(name)

    expect(response.name).toEqual(name)

    expect(response.queue.id).toEqual(expected.queue.id)

    expect(response.queue.address).toEqual(expected.queue.address)

    expect(response.queue.nonce).toEqual(expected.queue.nonce)

    expect(response.queue.config.executionDelay).toBeDefined()

    expect(response.queue.config.scheduleDeposit).toBeDefined()

    expect(response.queue.config.challengeDeposit).toBeDefined()

    expect(response.queue.config.resolver).toBeDefined()

    expect(response.queue.config.rules).toBeDefined()

    expect(response.queue.containers).toBeDefined()

    expect(response.executor.id).toEqual(expected.executor.id)
    expect(response.executor.address).toEqual(expected.executor.address)
    expect(response.executor.metadata).toBeDefined()
    expect(response.executor.balance).toEqual(expected.executor.balance)
    expect(response.executor.roles[0]).toBeDefined()

    expect(response.token).toEqual(expected.token)
    expect(response.registrant).toEqual(expected.registrant)

  })

  it('non-existent dao should return null', async () => {
    const name = "non-existent"

    const response = await dao(name)

    expect(response).toBeNull()
  })

})

