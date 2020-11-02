import GraphQLClient from '../../../internal/clients/graphql/GraphQLClient'
import DaosAction from '../../../internal/actions/DaosAction'
import daos from '../../../internal/clients/graphql/queries/daos'

//Mocks
jest.mock('../../../internal/clients/graphql/GraphQLClient')

/**
 * DaosAction test
 */
describe('DaoActionTest', () => {
  let action: DaosAction,
    clientMockClass = GraphQLClient as jest.MockedClass<typeof GraphQLClient>,
    clientMock: GraphQLClient


  beforeEach(() => {
    action = new DaosAction()
    clientMock = clientMockClass.mock.instances[0]
  })

  it('calls execute and does map the response accordingly', async () => {
    clientMock.request = jest.fn((query: string, args: any = {}) => {
      expect(query).toEqual(daos);

      expect(args).toEqual({})

      return Promise.resolve({daos: true})
    });

    const response = await action.execute();

    expect(response).toEqual(true)
  })
})
