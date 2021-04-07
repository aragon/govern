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
    const expected = daosData[2]
    const name = "GIORGI-DAO3"

    const rawResponse = await dao(name)

    expect(rawResponse).not.toBeNull()

    const response = rawResponse!

    expect(response.id).toEqual(expected.id)

    expect(response.address).toEqual(expected.address)

    expect(response.metadata).toBeDefined()

    expect(response.registryEntries[0].id).toEqual(name)

    expect(response.registryEntries[0].name).toEqual(name)

    expect(response.registryEntries[0].queue.id).toEqual(expected.registryEntries[0].queue.id)

    expect(response.registryEntries[0].queue.address).toEqual(expected.registryEntries[0].queue.address)

    expect(response.registryEntries[0].queue.config.executionDelay).toBeDefined()

    expect(response.registryEntries[0].queue.config.scheduleDeposit).toBeDefined()

    expect(response.registryEntries[0].queue.config.challengeDeposit).toBeDefined()

    expect(response.registryEntries[0].queue.config.resolver).toBeDefined()

    expect(response.registryEntries[0].queue.config.rules).toBeDefined()

    expect(Array.isArray(response.registryEntries[0].queue.queued)).toEqual(true)
  })

  it('non-existent dao should return null', async () => {
    const name = "non-existent"

    const response = await dao(name)

    expect(response).toBeNull()
  })
})
