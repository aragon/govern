import { configure, daos } from '@aragon/govern'
import { subgraphURL } from './config'
import { utils } from 'ethers'

/**
 * daos e2e test
 */
describe('[e2e] daos Test', () => {
  beforeEach(() => {
    configure({ subgraphURL })
  })

  it('calls daos and returns as expected', async () => {
    const response = await daos()

    expect(Array.isArray(response)).toEqual(true)

    expect(response[0].id).toBeDefined()
    expect(response[0].id.length).toBeGreaterThan(0)

    expect(response[0].name).toBeDefined()
    expect(response[0].name.length).toBeGreaterThan(0)

    expect(response[0].queue.id).toBeDefined()

    expect(utils.isAddress(response[0].queue.address)).toEqual(true)

    expect(response[0].queue.nonce).toBeDefined()

    expect(response[0].queue.config.executionDelay).toBeDefined()

    expect(response[0].queue.config.scheduleDeposit).toBeDefined()

    expect(response[0].queue.config.challengeDeposit).toBeDefined()

    expect(response[0].queue.config.resolver).toBeDefined()

    expect(response[0].queue.config.rules).toBeDefined()

    expect(Array.isArray(response[0].queue.containers)).toEqual(true)

    expect(response[0].executor.metadata).toBeDefined()
    expect(utils.isAddress(response[0].executor.address)).toEqual(true)
  })
})
