import GraphQLClient from '../../../internal/clients/graphql/GraphQLClient'
import Configuration from '../../../internal/configuration/Configuration'
import { DAO_FACTORY_ADDRESS } from '../../../internal/configuration/ConfigDefaults'

// Mocks
jest.mock('../../../internal/clients/graphql/GraphQLClient')


/**
 * Configuration test
 */
describe('ConfigurationTest', () => {
  let config: Configuration

  beforeEach(() => {
    config = new Configuration({ governURL: 'localhost', daoFactoryAddress: '0x123' })
  })

  it('initialization test', () => {
    expect(config.governURL).toEqual('localhost')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config.daoFactoryAddress).toEqual('0x123')
  })

  it('initialization failed test', () => {
    expect(() => {
      new Configuration({ governURL: null })
    }).toThrow('Missing Govern server URL!')
  })

  it('initialization factory address to null failed test', () => {
    expect(() => {
      new Configuration({ governURL: 'localhost', daoFactoryAddress: null })
    }).toThrow('Missing Dao factory address!')
  })

  it('calls Configuration.get and returns the expected default config', () => {
    const config = Configuration.get()

    expect(config.governURL).toEqual('https://govern.backend.aragon.org')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config.daoFactoryAddress).toEqual(DAO_FACTORY_ADDRESS)

    expect(config).toBeInstanceOf(Configuration)
  })

  it('calls Configuration.set without the governURL and defines the default aragon govern URL as expected', () => {
    Configuration.set({})

    const config = Configuration.get()

    expect(config.governURL).toEqual('https://govern.backend.aragon.org')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config.daoFactoryAddress).toEqual(DAO_FACTORY_ADDRESS)

    expect(config).toBeInstanceOf(Configuration)
  })
})
