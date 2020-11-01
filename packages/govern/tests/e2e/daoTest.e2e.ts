import { configure, dao } from '@aragon/govern'

/**
 * dao e2e test
 */
describe('[e2e] dao Test', () => {
  beforeEach(() => {
    configure({ governURL: 'http://localhost:3000/' })
  })

  it('calls dao and returns as expected', async () => {
    const response = await dao("M")

    expect(response.id).toEqual('0x24319b199e9e3867ede90eaf0fad56168c54d077')

    expect(response.address).toEqual('0x24319b199e9e3867ede90eaf0fad56168c54d077')

    expect(response.metadata).toBeDefined()

    expect(response.registryEntries[0].id).toEqual('M')

    expect(response.registryEntries[0].name).toEqual('M')

    expect(response.registryEntries[0].queue.id).toEqual('0x498cbf401df68196dc41b4bf53817088cb70b815')

    expect(response.registryEntries[0].queue.address).toEqual('0x498cbf401df68196dc41b4bf53817088cb70b815')

    expect(response.registryEntries[0].queue.config.executionDelay).toBeDefined()

    expect(response.registryEntries[0].queue.config.scheduleDeposit).toBeDefined()

    expect(response.registryEntries[0].queue.config.challengeDeposit).toBeDefined()

    expect(response.registryEntries[0].queue.config.resolver).toBeDefined()

    expect(response.registryEntries[0].queue.config.rules).toBeDefined()

    expect(Array.isArray(response.registryEntries[0].queue.queued)).toEqual(true)
  })
})
