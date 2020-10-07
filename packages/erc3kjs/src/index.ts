import fetch from 'isomorphic-unfetch'
import {
  Client,
  GraphQLRequest,
  createRequest as createRequestUrql,OperationContext, OperationResult
} from '@urql/core'
import { DocumentNode } from 'graphql'
import { ErrorConnection } from './errors'

export type QueryResult = OperationResult<any>
export type DataGql = any

export type ParseFunction = (data: DataGql) => any

// From https://github.com/FormidableLabs/urql/blob/ca68584a578b9f85d0b1448fc7a5fc9587f968de/packages/core/src/exchanges/subscription.ts#L39-L44
export interface SubscriptionOperation {
  query: string
  variables?: object
  key: string
  context: OperationContext
}


// Average block time is about 13 seconds on the 2020-08-14
// See https://etherscan.io/chart/blocktime
const POLL_INTERVAL_DEFAULT = 13 * 1000

type GraphQLWrapperOptions = {
  pollInterval?: number
  verbose?: boolean
}

export default class ERC3K {
  #client: Client
  #pollInterval: number
  #verbose: boolean

  constructor(
    subgraphUrl: string,
    options: GraphQLWrapperOptions | boolean = {}
  ) {
    if (typeof options === 'boolean') {
      console.warn(
        'GraphQLWrapper: please use `new GraphQLWrapper(url, { verbose })` rather than `new GraphQLWrapper(url, verbose)`.'
      )
      options = { verbose: options }
    }
    options = options as GraphQLWrapperOptions

    this.#verbose = options.verbose ?? false
    this.#pollInterval = options.pollInterval ?? POLL_INTERVAL_DEFAULT

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
