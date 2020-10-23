import AbstractAction from '../../../../internal/actions/lib/AbstractAction'
import gql from 'graphql-tag'
import GraphQLClient from '../../../../internal/clients/graphql/GraphQLClient'

// Created to be able to test the abstract class AbstractAction
class TestAction extends AbstractAction {
  protected gqlQuery = gql('query Test { name }')
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
    clientInstance.request = jest.fn((gqlQuery, parameters) => {
      expect(gqlQuery).toEqual(gql('query Test { name }'))

      expect(parameters).toEqual({ parameter: true })

      return Promise.resolve(true)
    })


    await expect(abstractAction.execute()).resolves.toEqual(true)

    expect(clientInstance.request).toHaveBeenCalledTimes(1)
  })
})
