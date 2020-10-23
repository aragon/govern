import { Client } from '@urql/core'
import fetch from 'isomorphic-unfetch'
import gql from 'graphql-tag'
import GraphQLClient from '../../../internal/clients/graphql/GraphQLClient'

// Mocks
jest.mock('@urql/core')
jest.mock('isomorphic-unfetch')

/**
 * GraphQLClient test
 */
describe('GraphQLClientTest', () => {
  let client: GraphQLClient,
    urqlClientMock: any,
    testQuery = gql('query Test { name }')

  const urqlClient = Client as jest.MockedClass<typeof Client>

  beforeEach(() => {
    client = new GraphQLClient('localhost')
    urqlClientMock = urqlClient.mock.instances[0]
  })

  it('constructor check', () => {
    expect(Client).toHaveBeenNthCalledWith(1, {
      maskTypename: true,
      url: 'localhost',
      fetch
    })
  })

  it('calls request and returns the expected result', async () => {
    const nestedToPromise = {
      toPromise: jest.fn(async () => {
        return { error: false }
      })
    }

    urqlClientMock.query = jest.fn((query, args) => {
      expect(query).toEqual(testQuery)

      expect(args).toEqual(args)

      return nestedToPromise
    })

    const result = await client.request(testQuery, { test: 'test' })

    expect(result).toEqual({ error: false })

    expect(urqlClientMock.query).toHaveBeenCalledTimes(1)

    expect(nestedToPromise.toPromise).toHaveBeenCalledTimes(1)
  })

  it('calls request and throws the expected error', async () => {
    const nestedToPromise = {
      toPromise: jest.fn(async () => {
        return {
          error: {
            name: 'ERROR',
            message: 'MESSAGE'
          },
          data: 'data',
          operation: {
            context: {
              url: 'localhost'
            },
            variables: 'variables',
            query: {
              loc: {
                source: {
                  body: 'body'
                }
              }
            }
          }
        }
      })
    }

    urqlClientMock.query = jest.fn((query, args) => {
      expect(query).toEqual(testQuery)

      expect(args).toEqual(args)

      return nestedToPromise
    })

    await expect(client.request(testQuery, { test: 'test' })).rejects.toEqual(new Error(
      'Govern: localhost\n' +
      '\n' +
      'Arguments: "variables"\n' +
      '\n' +
      'Query: body\n' +
      '\n' +
      'Returned data: "data"\n' +
      '\n' +
      'ERROR: MESSAGE\n\n'
    ))

    expect(urqlClientMock.query).toHaveBeenCalledTimes(1)

    expect(nestedToPromise.toPromise).toHaveBeenCalledTimes(1)
  })
})