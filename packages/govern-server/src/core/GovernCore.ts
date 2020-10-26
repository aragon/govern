import * as env from './config.json'
import {
  Address,
  DaoData,
  Network,
  Networkish,
  OptimisticGameData,
  GovernQueueData,
} from './types'
import { ErrorInvalidNetwork, ErrorUnexpectedResult } from './errors'
import { toNetwork } from './utils'
import GraphqlClient from './GraphqlClient'
import {
  QUERY_DAO,
  QUERY_DAOS,
  QUERY_GAME,
  QUERY_GAMES,
  QUERY_QUEUE,
  QUERY_QUEUES,
  QUERY_QUEUES_BY_DAO,
} from './thegraph-queries'

export type ConnectorTheGraphConfig = {
  network: Networkish
  subgraphUrl?: string
  verbose?: boolean
}

class GovernCore {
  #gql: GraphqlClient
  readonly config: ConnectorTheGraphConfig
  readonly network: Network

  constructor(config: ConnectorTheGraphConfig) {
    this.config = config
    this.network = toNetwork(config.network)

    const subgraphUrl = config.subgraphUrl || this.getSubgraphUrl(this.network)

    if (!subgraphUrl) {
      throw new ErrorInvalidNetwork(
        `The chainId ${this.network.chainId} is not supported ` +
          `by the TheGraph connector.`
      )
    }

    this.#gql = new GraphqlClient(subgraphUrl, {
      verbose: config.verbose,
    })
  }

  private getSubgraphUrl(network: Network): string | null {
    if (network.chainId === 1) {
      return null
    }
    if (network.chainId === 4) {
      return `https://api.thegraph.com/subgraphs/name/${env.subgraphAccount}/${env.rinkebySubgraphName}`
    }
    if (network.chainId === 100) {
      return null
    }
    return null
  }

  private async fetchResult<R>(
    queryAndParams:
      | [any]
      | [
          any, // TODO: use the type returned by gql``
          { [key: string]: any }
        ],
    errorMessage: string
  ): Promise<R> {
    const [query, params] = queryAndParams
    try {
      const result = await this.#gql.performQuery(query, params)
      return result.data as R
    } catch (err) {
      throw new ErrorUnexpectedResult(errorMessage)
    }
  }

  async dao(address: Address): Promise<DaoData | null> {
    const result = await this.fetchResult<{ govern: DaoData | null }>(
      [QUERY_DAO, { address: address.toLowerCase() }],
      `Unexpected result when fetching the dao ${address}.`
    )
    return result.govern ?? null
  }

  async daos(): Promise<DaoData[]> {
    const result = await this.fetchResult<{ governs: DaoData[] }>(
      [QUERY_DAOS],
      `Unexpected result when fetching the daos.`
    )
    return result.governs ?? []
  }

  async queue(address: Address): Promise<GovernQueueData | null> {
    const result = await this.fetchResult<{
      optimisticQueue: GovernQueueData | null
    }>(
      [QUERY_QUEUE, { queue: address.toLowerCase() }],
      `Unexpected result when fetching the queue ${address}.`
    )
    return result.optimisticQueue ?? null
  }

  async queues(): Promise<GovernQueueData[]> {
    const result = await this.fetchResult<{
      optimisticQueues: GovernQueueData[]
    }>([QUERY_QUEUES], `Unexpected result when fetching the queue.`)
    return result.optimisticQueues ?? []
  }

  async game(name: string): Promise<OptimisticGameData | null> {
    const result = await this.fetchResult<{
      optimisticGame: OptimisticGameData | null
    }>(
      [QUERY_GAME, { name }],
      `Unexpected result when fetching the game ${name}.`
    )
    return result.optimisticGame ?? null
  }

  async games(): Promise<OptimisticGameData[]> {
    const result = await this.fetchResult<{
      optimisticGames: OptimisticGameData[]
    }>([QUERY_GAMES], `Unexpected result when fetching the games.`)
    return result.optimisticGames ?? []
  }

  async queuesForDao(address: Address): Promise<GovernQueueData[]> {
    const result = await this.fetchResult<{ govern: DaoData }>(
      [QUERY_QUEUES_BY_DAO, { address }],
      `Unexpected result when fetching the queues for dao ${address}.`
    )
    const games = result.govern?.games ?? []
    return games.reduce<GovernQueueData[]>((queues, game) => {
      return game?.queue ? [...queues, game.queue] : queues
    }, [])
  }
}

export default GovernCore
