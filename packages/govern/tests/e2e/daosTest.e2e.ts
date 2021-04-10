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

    const expected = daosData[1]

    expect(response[0].id).toEqual(expected.id)

    expect(response[0].name).toEqual(expected.name)

    expect(response[0].queue.id).toEqual(expected.queue.id)

    expect(response[0].queue.address).toEqual(expected.queue.address)

    expect(response[0].queue.nonce).toEqual(expected.queue.nonce)

    expect(response[0].queue.config.executionDelay).toBeDefined()

    expect(response[0].queue.config.scheduleDeposit).toBeDefined()

    expect(response[0].queue.config.challengeDeposit).toBeDefined()

    expect(response[0].queue.config.resolver).toBeDefined()

    expect(response[0].queue.config.rules).toBeDefined()

    expect(Array.isArray(response[0].queue.containers)).toEqual(true)

    expect(response[0].executor.metadata).toBeDefined()

  })
})
