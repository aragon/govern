import fetch from 'isomorphic-unfetch'
import { Client } from '@urql/core'
import gql from 'graphql-tag'
import ClientInterface from '../lib/ClientInterface'

/**
 *
 * @class GraphQLClient
 */
export default class GraphQLClient implements ClientInterface {
  /**
   * The urql/core Client object
   *
   * @var {Client} client
   *
   * @private
   */
  private client: Client

  /**
   * @param {string} governUrl
   *
   * @constructor
   */
  constructor(private governUrl: string) {
    this.connect()
  }

  /**
   * Initiates the Client from urql/core
   *
   * @method connect
   *
   * @returns {void}
   */
  private connect(): void {
    this.client = new Client({
      maskTypename: true,
      url: this.governUrl,
      fetch
    })
  }

  /**
   * Executes the query against the connected Govern server
   *
   * @method request
   *
   * @param {string} query
   * @param {Object} args
   *
   * @returns {Promise<any>} - Returns the data object or throws an error
   *
   * @public
   */
  public async request(query: string, args: any = {}): Promise<any> {
    const result = await this.client.query(gql(query), args).toPromise()

    if (result.error) { // TODO: Use errors from core
      throw new Error(
        this.mapResponse(result) + this.mapError(result.error)
      )
    }

    return result.data
  }

  /**
   * Maps the received response into the required format
   *
   * @method mapResponse
   *
   * @param {any} result - Response from Govern server
   *
   * @returns {String}
   *
   * @private
   */
  private mapResponse(result: any): string {
    return (
      `Govern: ${result.operation.context.url}\n\n` +
      `Arguments: ${JSON.stringify(result.operation.variables, null, 2)}\n\n` +
      `Query: ${result.operation.query.loc?.source.body}\n\n` +
      `Returned data: ${JSON.stringify(result.data, null, 2)}\n\n`
    )
  }

  /**
   * Maps the received error into the required format
   *
   * @method mapError
   *
   * @param {any} error
   *
   * @returns {string}
   *
   * @private
   */
  private mapError(error: Error): string {
    return `${error.name}: ${error.message}\n\n`
  }
}
