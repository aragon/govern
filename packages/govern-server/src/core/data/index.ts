import { ErrorInvalidNetwork, ErrorUnexpectedResult } from '../errors'
import { toNetwork } from '../utils'
import {
  Address,
  DaoData,
  Network,
  Networkish,
  OptimisticGameData,
  GovernQueueData,
  QueryResult,
} from '../types'
import * as queries from './queries'
import TheGraphWrapper from './TheGraphWrapper'

export type ConnectorTheGraphConfig = {
  network: Networkish
  subgraphUrl?: string
  verbose?: boolean
}

function getSubgraphUrl(network: Network): string | null {
  if (network.chainId === 1) {
    return 'placeholder'
  }
  if (network.chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/0xgabi/aragon-govern-rinkeby-staging'
  }
  if (network.chainId === 100) {
    return 'placeholder'
  }
  return null
}

class ConnectorTheGraph {
  #gql: TheGraphWrapper
  readonly config: ConnectorTheGraphConfig
  readonly network: Network

  constructor(config: ConnectorTheGraphConfig) {
    this.config = config
    this.network = toNetwork(config.network)

    const orgSubgraphUrl = config.subgraphUrl || getSubgraphUrl(this.network)

    if (!orgSubgraphUrl) {
      throw new ErrorInvalidNetwork(
        `The chainId ${this.network.chainId} is not supported ` +
          `by the TheGraph connector.`
      )
    }

    this.#gql = new TheGraphWrapper(orgSubgraphUrl, {
      verbose: config.verbose,
    })
  }

  private async fetchResult<T>(
    queryAndParams:
      | [any]
      | [
          any, // TODO: find or define the type returned by gql()
          { [key: string]: any }
        ],
    callback: (data: { [key: string]: T }) => T,
    errorMessage: string
  ) {
    const [query, params] = queryAndParams
    try {
      const result = await this.#gql.performQuery(query, params)
      return callback(result.data) as T
    } catch (err) {
      throw new ErrorUnexpectedResult(errorMessage)
    }
  }

  async dao(address: Address): Promise<DaoData | null> {
    return this.fetchResult<DaoData | null>(
      [queries.DAO, { dao: address.toLowerCase() }],
      (data) => data.govern ?? null,
      `Unexpected result when fetching the dao ${address}.`
    )
  }

  async daos(): Promise<DaoData[]> {
    return this.fetchResult<DaoData[]>(
      [queries.DAOS],
      (data) => data.governs ?? [],
      `Unexpected result when fetching the daos.`
    )
  }

  async queue(address: Address): Promise<GovernQueueData | null> {
    return this.fetchResult<GovernQueueData | null>(
      [queries.QUEUE, { queue: address.toLowerCase() }],
      (data) => data.governQueue ?? null,
      `Unexpected result when fetching the queue ${address}.`
    )
  }

  async queues(): Promise<GovernQueueData[]> {
    return this.fetchResult<GovernQueueData[]>(
      [queries.QUEUES],
      (data) => data.governQueues ?? [],
      `Unexpected result when fetching the queue.`
    )
  }

  async game(name: string): Promise<OptimisticGameData | null> {
    return this.fetchResult<OptimisticGameData | null>(
      [queries.GAME, { name }],
      (data) => data.optimisticGame ?? null,
      `Unexpected result when fetching the game ${name}.`
    )
  }

  async games(): Promise<OptimisticGameData[]> {
    return this.fetchResult<OptimisticGameData[]>(
      [queries.GAMES],
      (data) => data.optimisticGames ?? [],
      `Unexpected result when fetching the games.`
    )
  }

  async queuesForDao(dao: Address): Promise<OptimisticGameData[]> {
    return this.fetchResult<OptimisticGameData[]>(
      [queries.QUEUES_BY_DAO, { dao }],
      (data) => data.optimisticGame ?? [],
      `Unexpected result when fetching the queues for dao ${dao}.`
    )
  }
}

export default ConnectorTheGraph
