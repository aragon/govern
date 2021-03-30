import { configure, daos } from '@aragon/govern'
import { subgraphURL } from './config'
import * as daosData from '../fixtures/daos-data.json'
/**
 * daos e2e test
 */
describe('[e2e] daos Test', () => {
  beforeEach(() => {
    configure({ subgraphURL })
  })

  it('calls daos and returns as expected', async () => {
    const response = await daos()

    const expected = daosData[0]
    const expectedRegistry = expected.registryEntries[0]

    expect(response[0].id).toEqual(expected.id)

    expect(response[0].address).toEqual(expected.address)

    expect(response[0].metadata).toBeDefined()

    expect(response[0].registryEntries[0].id).toEqual(expectedRegistry.id)

    expect(response[0].registryEntries[0].name).toEqual(expectedRegistry.name)

    expect(response[0].registryEntries[0].queue.id).toEqual(expectedRegistry.queue.id)

    expect(response[0].registryEntries[0].queue.address).toEqual(expectedRegistry.queue.address)

    expect(response[0].registryEntries[0].queue.config.executionDelay).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.scheduleDeposit).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.challengeDeposit).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.resolver).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.rules).toBeDefined()

    expect(Array.isArray(response[0].registryEntries[0].queue.queued)).toEqual(true)
  })
})
