import { query } from '../../public'
import Configuration from '../../internal/configuration/Configuration'
import GraphQLClient from '../../internal/clients/graphql/GraphQLClient'

// Mocks
jest.mock('../../internal/clients/graphql/GraphQLClient')

/**
 * query test
 */
describe('query Test', () => {
  const graphQLClientMock = GraphQLClient as jest.MockedClass<
    typeof GraphQLClient
  >

  it('calls query and executes as expected', async () => {
    await query('quest Test { name }')

    expect(GraphQLClient).toHaveBeenNthCalledWith(
      1,
      Configuration.get().subgraphURL
    )

    expect(graphQLClientMock.mock.instances[0].request).toHaveBeenNthCalledWith(
      1,
      'quest Test { name }',
      {}
    )
  })
})
