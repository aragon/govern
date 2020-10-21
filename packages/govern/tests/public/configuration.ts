import { mocked } from 'ts-jest/utils'
import GraphQLClient from '../../internal/clients/GraphQLClient'
import Configuration from '../../internal/configuration/Configuration'
import configuration from '../../public/configuration'

// Mocks
jest.mock('../../internal/configuration/Configuration')
mocked(Configuration, true)

jest.mock('../../internal/clients/GraphQLClient')
mocked(GraphQLClient, true)

/**
 * configuration test
 */
describe('configuration Test', () => {
  let graphQLClientMock

  beforeEach(() => {
    graphQLClientMock = new GraphQLClient('')
  })

  it('configuration test', () => {
    configuration({ governURL: 'localhost' })

    expect(configuration.global.governURL).toEqual('localhost')

    expect(configuration.global.client).toEqual(graphQLClientMock)

    expect(configuration.global).toBeInstanceOf(Configuration)
  })
})