import GraphQLClient from '../../../internal/clients/graphql/GraphQLClient'
import DaoAction from '../../../internal/actions/DaoAction'
import dao from '../../../internal/clients/graphql/queries/dao'

//Mocks
jest.mock('../../../internal/clients/graphql/GraphQLClient')

/**
 * DaoAction test
 */
describe('DaoActionTest', () => {
  let action: DaoAction,
    clientMockClass = GraphQLClient as jest.MockedClass<typeof GraphQLClient>,
    clientMock: GraphQLClient


  beforeEach(() => {
    action = new DaoAction({ name: 'myName' })
    clientMock = clientMockClass.mock.instances[0]
  })

  it('calls execute and does map the response accordingly', async () => {
    clientMock.request = jest.fn((query: string, args: any = {}) => {
      expect(query).toEqual(dao);

      expect(args).toEqual({name: 'myName'})

      return Promise.resolve({ dao: true })
    });

    const response = await action.execute();

    expect(response).toEqual(true)
  })
})
