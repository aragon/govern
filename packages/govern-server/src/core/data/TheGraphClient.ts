import fetch from 'isomorphic-unfetch'
import { Client } from '@urql/core'
import { DocumentNode } from 'graphql'
import { ErrorConnection } from '../errors'
import { QueryResult } from '../types'

type TheGraphClientOptions = {
  verbose?: boolean
}

class TheGraphClient {
  #client: Client
  #verbose: boolean

  constructor(
    subgraphUrl: string,
    options: TheGraphClientOptions | boolean = {}
  ) {
    this.#verbose = this.parseOptions(options).verbose ?? false
    this.#client = new Client({ maskTypename: true, url: subgraphUrl, fetch })
  }

  private parseOptions(
    options: TheGraphClientOptions | boolean = {}
  ): TheGraphClientOptions {
    if (typeof options === 'boolean') {
      console.warn(
        'TheGraphClient: please use `new TheGraphClient(url, { verbose })` rather than `new TheGraphClient(url, verbose)`.'
      )
      options = { verbose: options }
    }
    return options
  }

  async performQuery(
    query: DocumentNode,
    args: any = {}
  ): Promise<QueryResult> {
    const result = await this.#client.query(query, args).toPromise()

    const resultMapped = this.mapQueryResult(result)

    if (this.#verbose) {
      console.log(resultMapped)
    }

    if (result.error) {
      throw new ErrorConnection(this.mapQueryResultError(result) + resultMapped)
    }

    return result
  }

  private mapQueryResult(result: QueryResult): string {
    return (
      `Subgraph: ${result.operation.context.url}\n\n` +
      `Arguments: ${JSON.stringify(result.operation.variables, null, 2)}\n\n` +
      `Query: ${result.operation.query.loc?.source.body}\n\n` +
      `Returned data: ${JSON.stringify(result.data, null, 2)}\n\n`
    )
  }

  private mapQueryResultError(result: QueryResult): string {
    if (!result.error) {
      return ''
    }
    return `${result.error.name}: ${result.error.message}\n\n`
  }
}

export default TheGraphClient
