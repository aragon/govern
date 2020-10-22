import AbstractAction from '../../../../internal/actions/lib/AbstractAction'
import Configuration from '../../../../internal/configuration/Configuration'
import gql from 'graphql-tag'

// Created to be able to test the abstract class AbstractAction
class TestAction extends AbstractAction {
  protected gqlQuery = gql('query Test { name }')
}

// Mocks
jest.mock('../../../../internal/configuration/Configuration')

/**
 * AbstractAction test
 */
describe('AbstractActionTest', () => {
  let abstractAction: AbstractAction,
    configurationMock: any

  beforeEach(() => {
    configurationMock = new Configuration({ governURL: 'localhost' })
    abstractAction = new TestAction(configurationMock, { parameter: true })
  })

  it('calls execute and returns the expected result', async () => {
    configurationMock.client = {
      request: jest.fn((gqlQuery, parameters) => {
        expect(gqlQuery).toEqual(gql('query Test { name }'))

        expect(parameters).toEqual({ parameter: true })

        return Promise.resolve(true)
      })
    }

    await expect(abstractAction.execute()).resolves.toEqual(true)

    expect(configurationMock.client.request).toHaveBeenCalledTimes(1)
  })
})
