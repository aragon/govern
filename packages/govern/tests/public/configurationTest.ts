import Configuration from '../../internal/configuration/Configuration'
import GraphQLClient from '../../internal/clients/graphql/GraphQLClient'
import { ConfigurationObject, configure } from '../../public/configure'

// Mocks
jest.mock('../../internal/clients/graphql/GraphQLClient')

/**
 * configure test
 */
describe('configure Test', () => {
  it('calls configure and defines the expected default config', () => {
    configure({ governURL: 'localhost' } as ConfigurationObject)

    const config = Configuration.get()

    expect(config.governURL).toEqual('localhost')

    expect(config.client).toBeInstanceOf(GraphQLClient)

    expect(config).toBeInstanceOf(Configuration)
  })
})
