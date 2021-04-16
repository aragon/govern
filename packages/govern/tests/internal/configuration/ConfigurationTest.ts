import GraphQLClient from '../../../internal/clients/graphql/GraphQLClient'
import Configuration from '../../../internal/configuration/Configuration'
import { DAO_FACTORY_ADDRESS } from '../../../internal/configuration/ConfigDefaults'

// Mocks
jest.mock('../../../internal/clients/graphql/GraphQLClient')

const expected = {
  "defaultUrl": "https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet"
}

/**
 * Configuration test
 */
describe('ConfigurationTest', () => {
  let config: Configuration

  beforeEach(() => {
    config = new Configuration({ subgraphURL: 'localhost', daoFactoryAddress: '0x123' })
  })

  it('initialization test', () => {
    expect(config.subgraphURL).toEqual('localhost')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config.daoFactoryAddress).toEqual('0x123')
  })

  it('initialization failed test', () => {
    expect(() => {
      new Configuration({ subgraphURL: null })
    }).toThrow('Missing Govern subgraph URL!')
  })

  it('initialization factory address to null failed test', () => {
    expect(() => {
      new Configuration({ subgraphURL: 'localhost', daoFactoryAddress: null })
    }).toThrow('Missing Dao factory address!')
  })

  it('calls Configuration.get and returns the expected default config', () => {
    const config = Configuration.get()

    expect(config.subgraphURL).toEqual(expected.defaultUrl)

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config.daoFactoryAddress).toEqual(DAO_FACTORY_ADDRESS)

    expect(config).toBeInstanceOf(Configuration)
  })

  it('calls Configuration.set without the subgraphURL and receives the default subgraph URL as expected', () => {
    Configuration.set({})

    const config = Configuration.get()

    expect(config.subgraphURL).toEqual(expected.defaultUrl)

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config.daoFactoryAddress).toEqual(DAO_FACTORY_ADDRESS)

    expect(config).toBeInstanceOf(Configuration)
  })
})
