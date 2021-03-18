import GraphQLClient from '../../../internal/clients/graphql/GraphQLClient'
import Configuration from '../../../internal/configuration/Configuration'
import expected from '../../fixtures/config-data'

// Mocks
jest.mock('../../../internal/clients/graphql/GraphQLClient')

/**
 * Configuration test
 */
describe('ConfigurationTest', () => {
  let config: Configuration

  beforeEach(() => {
    config = new Configuration({ subgraphURL: 'localhost' })
  })

  it('initialization test', () => {
    expect(config.subgraphURL).toEqual('localhost')

    expect(config.client).toBeInstanceOf(GraphQLClient)
  })

  it('initialization failed test', () => {
    expect(() => {
      new Configuration({ subgraphURL: null })
    }).toThrow('Missing Govern subgraph URL!')
  })

  it('calls Configuration.get and returns the expected default config', () => {
    const config = Configuration.get()

    expect(config.subgraphURL).toEqual(expected.defaultUrl)

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config).toBeInstanceOf(Configuration)
  })

  it('calls Configuration.set without the subgraphURL and defines the default URL as expected', () => {
    Configuration.set({})

    const config = Configuration.get()

    expect(config.subgraphURL).toEqual(expected.defaultUrl)

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config).toBeInstanceOf(Configuration)
  })
})
