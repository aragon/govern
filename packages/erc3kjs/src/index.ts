import { providers } from 'ethers'
import fetch from 'isomorphic-unfetch'
import { Client, OperationResult } from '@urql/core'
import { DocumentNode } from 'graphql'
import { ErrorConnection } from './errors'

export type QueryResult = OperationResult<any>

type GraphQLWrapperOptions = {
  verbose?: boolean
  chainId: number
}

function getNodeByChainId(chainId: number) {
  return chainId === 1
    ? 'https://mainnet.eth.aragon.network/'
    : 'https://rinkeby.eth.aragon.network/'
}

export default class ERC3K {
  ethers: providers.JsonRpcProvider
  #client: Client
  #verbose: boolean

  constructor(
    subgraphUrl: string,
    ethereum: any,
    options: GraphQLWrapperOptions | boolean = { chainId: 4 }
  ) {
    if (typeof options === 'boolean') {
      console.warn(
        'GraphQLWrapper: please use `new GraphQLWrapper(url, { verbose })` rather than `new GraphQLWrapper(url, verbose)`.'
      )
      options = { verbose: options, chainId: 4 }
    }
    options = options as GraphQLWrapperOptions

    this.#verbose = options.verbose ?? false

    this.#client = new Client({ maskTypename: true, url: subgraphUrl, fetch })

    this.ethers = ethereum
      ? new providers.Web3Provider(ethereum)
      : new providers.JsonRpcProvider(getNodeByChainId(options.chainId))
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
