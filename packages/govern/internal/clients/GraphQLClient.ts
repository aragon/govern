import fetch from 'isomorphic-unfetch'
import { Client } from '@urql/core'
import { DocumentNode } from 'graphql'

/**
 * TODO: Use QueryResult type from govern-server/core
 *
 * @class GraphQLClient
 */
export default class GraphQLClient {
  /**
   * The urql/core Client object
   *
   * @var {Client} client
   *
   * @private
   */
  private client: Client;

  /**
   * @param {string} governUrl
   *
   * @constructor
   */
  constructor(private governUrl: string) {
    this.connect();
  }

  /**
   * Initiates the Client from urql/core
   *
   * @method connect
   *
   * @returns {void}
   */
  private connect(): void {
    this.client = new Client({ maskTypename: true, url: this.governUrl, fetch })
  }

  /**
   * Executes the query against the connected Govern server
   *
   * @method query
   *
   * @param {DocumentNode} query
   * @param {Object} args
   *
   * @returns {Promise<any>}
   *
   * @public
   */
  public async query(query: DocumentNode, args: any = {}): Promise<any> {
    const result = await this.client.query(query, args).toPromise()

    if (result.error) { // TODO: Use errors from core
      throw new Error(
        this.mapResponse(result) + this.mapError(result)
      )
    }

    return result
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
    const queryStr = result.operation.query.loc?.source.body;
    const dataStr = JSON.stringify(result.data, null, 2);
    const argsStr = JSON.stringify(result.operation.variables, null, 2);
    const subgraphUrl = result.operation.context.url;

    return (
      `Subgraph: ${subgraphUrl}\n\n` +
      `Arguments: ${argsStr}\n\n` +
      `Query: ${queryStr}\n\n` +
      `Returned data: ${dataStr}\n\n`
    )
  }

  /**
   * Maps the received error into the required format
   *
   * @method mapError
   *
   * @param {any} result
   *
   * @returns {string}
   *
   * @private
   */
  private mapError(result: any): string {
    if (!result.error) {
      return ''
    }

    return `${result.error.name}: ${result.error.message}\n\n`
  }
}
