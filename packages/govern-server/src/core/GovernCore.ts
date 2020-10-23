import {
  Address,
  DaoData,
  Network,
  Networkish,
  OptimisticGameData,
  GovernQueueData,
  GovernQueueData,
} from './types'
import { ErrorInvalidNetwork, ErrorUnexpectedResult } from './errors'
import { toNetwork } from './utils'
import * as queries from './thegraph-queries'
import GraphqlClient from './GraphqlClient'

export type ConnectorTheGraphConfig = {
  network: Networkish
  subgraphUrl?: string
  verbose?: boolean
}

function getSubgraphUrl(network: Network): string | null {
  if (network.chainId === 1) {
    return null
  }
  if (network.chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby'
  }
  if (network.chainId === 100) {
    return null
  }
  return null
}

class GovernCore {
  #gql: GraphqlClient
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

    this.#gql = new GraphqlClient(orgSubgraphUrl, {
      verbose: config.verbose,
    })
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
      [queries.DAO, { address: address.toLowerCase() }],
      `Unexpected result when fetching the dao ${address}.`
    )
    return result.govern ?? null
  }

  async daos(): Promise<DaoData[]> {
    const result = await this.fetchResult<{ governs: DaoData[] }>(
      [queries.DAOS],
      `Unexpected result when fetching the daos.`
    )
    return result.governs ?? []
  }

  async queue(address: Address): Promise<GovernQueueData | null> {
    const result = await this.fetchResult<{
      optimisticQueue: GovernQueueData | null
    }>(
      [queries.QUEUE, { queue: address.toLowerCase() }],
      `Unexpected result when fetching the queue ${address}.`
    )
    return result.optimisticQueue ?? null
  }

  async queues(): Promise<GovernQueueData[]> {
    const result = await this.fetchResult<{
      optimisticQueues: GovernQueueData[]
    }>([queries.QUEUES], `Unexpected result when fetching the queue.`)
    return result.optimisticQueues ?? []
  }

  async game(name: string): Promise<OptimisticGameData | null> {
    const result = await this.fetchResult<{
      optimisticGame: OptimisticGameData | null
    }>(
      [queries.GAME, { name }],
      `Unexpected result when fetching the game ${name}.`
    )
    return result.optimisticGame ?? null
  }

  async games(): Promise<OptimisticGameData[]> {
    const result = await this.fetchResult<{
      optimisticGames: OptimisticGameData[]
    }>([queries.GAMES], `Unexpected result when fetching the games.`)
    return result.optimisticGames ?? []
  }

  async queuesForDao(address: Address): Promise<GovernQueueData[]> {
    const result = await this.fetchResult<{ govern: DaoData }>(
      [queries.QUEUES_BY_DAO, { address }],
      `Unexpected result when fetching the queues for dao ${address}.`
    )
    const games = result.govern?.games ?? []
    return games.reduce<GovernQueueData[]>((queues, game) => {
      return game?.queue ? [...queues, game.queue] : queues
    }, [])
  }
}

export default GovernCore
