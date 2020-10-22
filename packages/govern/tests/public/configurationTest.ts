import GraphQLClient from '../../internal/clients/GraphQLClient'
import Configuration from '../../internal/configuration/Configuration'
import configure, { getConfiguration, ConfigurationObject } from '../../public/configure'

// Mocks
jest.mock('../../internal/clients/GraphQLClient')

/**
 * configure test
 */
describe('configure Test', () => {
  it('calls getConfiguration and returns the expected default config', () => {
    const config = getConfiguration()

    expect(config.governURL).toEqual('https://govern.backend.aragon.org')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config).toBeInstanceOf(Configuration)
  })

  it('calls configure and defines the expected default config', () => {
    configure({ governURL: 'localhost' } as ConfigurationObject)

    const config = getConfiguration()

    expect(config.governURL).toEqual('localhost')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config).toBeInstanceOf(Configuration)
  })

  it('calls configure without the governURL and defines the default aragon govern URL as expected', () => {
    configure({})

    const config = getConfiguration()

    expect(config.governURL).toEqual('https://govern.backend.aragon.org')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config).toBeInstanceOf(Configuration)
  })
})