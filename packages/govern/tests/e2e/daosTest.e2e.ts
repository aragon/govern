import { configure, daos } from '@aragon/govern'

/**
 * daos e2e test
 */
describe('[e2e] daos Test', () => {
  beforeEach(() => {
    configure({ governURL: 'http://localhost:3000/' })
  })

  it('calls daos and returns as expected', async () => {
    const response = await daos()

    expect(response[0].id).toEqual('0x24319b199e9e3867ede90eaf0fad56168c54d077')

    expect(response[0].address).toEqual('0x24319b199e9e3867ede90eaf0fad56168c54d077')

    expect(response[0].metadata).toBeDefined()

    expect(response[0].registryEntries[0].id).toEqual('M')

    expect(response[0].registryEntries[0].name).toEqual('M')

    expect(response[0].registryEntries[0].queue.id).toEqual('0x498cbf401df68196dc41b4bf53817088cb70b815')

    expect(response[0].registryEntries[0].queue.address).toEqual('0x498cbf401df68196dc41b4bf53817088cb70b815')

    expect(response[0].registryEntries[0].queue.config.executionDelay).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.scheduleDeposit).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.challengeDeposit).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.resolver).toBeDefined()

    expect(response[0].registryEntries[0].queue.config.rules).toBeDefined()

    expect(Array.isArray(response[0].registryEntries[0].queue.queued)).toEqual(true)
  })
})
