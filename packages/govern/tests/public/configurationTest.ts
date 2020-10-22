import GraphQLClient from '../../internal/clients/GraphQLClient'
import Configuration from '../../internal/configuration/Configuration'
import configuration, { ConfigurationObject } from '../../public/configuration'

// Mocks
jest.mock('../../internal/clients/GraphQLClient')

/**
 * configuration test
 */
describe('configuration Test', () => {
  it('configuration test', () => {
    configuration({ governURL: 'localhost' } as ConfigurationObject)

    expect(configuration.global.governURL).toEqual('localhost')

    expect(configuration.global.client).toBeInstanceOf(GraphQLClient)

    expect(configuration.global).toBeInstanceOf(Configuration)
  })
})