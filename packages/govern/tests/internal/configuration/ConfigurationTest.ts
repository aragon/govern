import GraphQLClient from '../../../internal/clients/graphql/GraphQLClient'
import Configuration from '../../../internal/configuration/Configuration'

// Mocks
jest.mock('../../../internal/clients/GraphQLClient')

/**
 * Configuration test
 */
describe('ConfigurationTest', () => {
  let config: Configuration

  beforeEach(() => {
    config = new Configuration({ governURL: 'localhost' })
  })

  it('initialization test', () => {
    expect(config.governURL).toEqual('localhost')

    expect(config.client).toBeInstanceOf(GraphQLClient)
  })

  it('initialization failed test', () => {
    expect(() => {
      new Configuration({ governURL: null })
    }).toThrow('Missing Govern server URL!')
  })
})