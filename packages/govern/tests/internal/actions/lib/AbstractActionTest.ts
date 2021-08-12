import AbstractAction from '../../../../internal/actions/lib/AbstractAction'
import GraphQLClient from '../../../../internal/clients/graphql/GraphQLClient'

class TestAction extends AbstractAction {
  protected gqlQuery: string = 'query Test { name }'
}

jest.mock('../../../../internal/clients/graphql/GraphQLClient')

/**
 * AbstractAction test
 */
describe('AbstractActionTest', () => {
  let abstractAction: AbstractAction,
    clientMock = GraphQLClient as jest.MockedClass<typeof GraphQLClient>,
    clientInstance: GraphQLClient

  beforeEach(() => {
    abstractAction = new TestAction({ parameter: true })
    clientInstance = clientMock.mock.instances[0]
  })

  it('calls execute and returns the expected result', async () => {
    //@ts-ignore
    clientInstance.request = jest.fn((gqlQuery, parameters) => {
      expect(gqlQuery).toEqual('query Test { name }')

      expect(parameters).toEqual({ parameter: true })

      return Promise.resolve(true)
    })

    await expect(abstractAction.execute()).resolves.toEqual(true)

    expect(clientInstance.request).toHaveBeenCalledTimes(1)
  })
})
