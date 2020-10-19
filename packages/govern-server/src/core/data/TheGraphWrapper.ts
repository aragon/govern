import fetch from 'isomorphic-unfetch'
import { Client } from '@urql/core'
import { DocumentNode } from 'graphql'
import { ErrorConnection } from '../errors'
import { QueryResult } from '../types'

type TheGraphWrapperOptions = {
  verbose?: boolean
}

export default class TheGraphWrapper {
  #client: Client
  #verbose: boolean

  constructor(
    subgraphUrl: string,
    options: TheGraphWrapperOptions | boolean = {}
  ) {
    if (typeof options === 'boolean') {
      console.warn(
        'TheGraphWrapper: please use `new TheGraphWrapper(url, { verbose })` rather than `new TheGraphWrapper(url, verbose)`.'
      )
      options = { verbose: options }
    }
    options = options as TheGraphWrapperOptions

    this.#verbose = options.verbose ?? false
    this.#client = new Client({ maskTypename: true, url: subgraphUrl, fetch })
  }

  async performQuery(
    query: DocumentNode,
    args: any = {}
  ): Promise<QueryResult> {
    const result = await this.#client.query(query, args).toPromise()

    if (this.#verbose) {
      console.log(this.describeQueryResult(result))
    }

    if (result.error) {
      throw new ErrorConnection(
        this.describeQueryResultError(result) + this.describeQueryResult(result)
      )
    }

    return result
  }

  private describeQueryResult(result: QueryResult): string {
    const queryStr = result.operation.query.loc?.source.body
    const dataStr = JSON.stringify(result.data, null, 2)
    const argsStr = JSON.stringify(result.operation.variables, null, 2)
    const subgraphUrl = result.operation.context.url

    return (
      `Subgraph: ${subgraphUrl}\n\n` +
      `Arguments: ${argsStr}\n\n` +
      `Query: ${queryStr}\n\n` +
      `Returned data: ${dataStr}\n\n`
    )
  }

  private describeQueryResultError(result: QueryResult): string {
    if (!result.error) {
      return ''
    }
    return `${result.error.name}: ${result.error.message}\n\n`
  }
}
