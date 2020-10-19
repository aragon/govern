import { ErrorInvalidNetwork, ErrorUnexpectedResult } from '../errors'
import { toNetwork } from '../utils'
import {
  Address,
  DaoData,
  Network,
  Networkish,
  OptimisticGameData,
  OptimisticQueueData,
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

  private async fetchResult<ReturnType>(
    queryAndParams:
      | [any]
      | [
          any, // TODO: use the type returned by gql``
          { [key: string]: any }
        ],
    callback: (data: unknown) => ReturnType,
    errorMessage: string
  ): Promise<ReturnType> {
    const [query, params] = queryAndParams
    try {
      const result = await this.#gql.performQuery(query, params)
      return callback(result.data as unknown) as ReturnType
    } catch (err) {
      throw new ErrorUnexpectedResult(errorMessage)
    }
  }

  async dao(address: Address): Promise<DaoData | null> {
    return this.fetchResult<DaoData | null>(
      [queries.DAO, { address: address.toLowerCase() }],
      (data) => (data as { govern: DaoData }).govern ?? null,
      `Unexpected result when fetching the dao ${address}.`
    )
  }

  async daos(): Promise<DaoData[]> {
    return this.fetchResult<DaoData[]>(
      [queries.DAOS],
      (data) => (data as { governs: DaoData[] }).governs ?? [],
      `Unexpected result when fetching the daos.`
    )
  }

  async queue(address: Address): Promise<OptimisticQueueData | null> {
    return this.fetchResult<OptimisticQueueData | null>(
      [queries.QUEUE, { queue: address.toLowerCase() }],
      (data) =>
        (data as { optimisticQueue: OptimisticQueueData }).optimisticQueue ??
        null,
      `Unexpected result when fetching the queue ${address}.`
    )
  }

  async queues(): Promise<OptimisticQueueData[]> {
    return this.fetchResult<OptimisticQueueData[]>(
      [queries.QUEUES],
      (data) =>
        (data as { optimisticQueues: OptimisticQueueData[] })
          .optimisticQueues ?? [],
      `Unexpected result when fetching the queue.`
    )
  }

  async game(name: string): Promise<OptimisticGameData | null> {
    return this.fetchResult<OptimisticGameData | null>(
      [queries.GAME, { name }],
      (data) =>
        (data as { optimisticGame: OptimisticGameData }).optimisticGame ?? null,
      `Unexpected result when fetching the game ${name}.`
    )
  }

  async games(): Promise<OptimisticGameData[]> {
    return this.fetchResult<OptimisticGameData[]>(
      [queries.GAMES],
      (data) =>
        (data as { optimisticGames: OptimisticGameData[] }).optimisticGames ??
        [],
      `Unexpected result when fetching the games.`
    )
  }

  async queuesForDao(address: Address): Promise<OptimisticQueueData[]> {
    return this.fetchResult<OptimisticQueueData[]>(
      [queries.QUEUES_BY_DAO, { address }],
      (data) => {
        const games = (data as { govern: DaoData })?.govern?.games ?? []
        return games.reduce<OptimisticQueueData[]>((queues, game) => {
          return game?.queue ? [...queues, game.queue] : queues
        }, [])
      },
      `Unexpected result when fetching the queues for dao ${address}.`
    )
  }
}

export default ConnectorTheGraph
