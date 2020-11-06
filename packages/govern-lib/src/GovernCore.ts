import {
  Address,
  DaoData,
  Networkish,
  RegistryEntryData,
  GovernQueueData,
} from './types'
import { ErrorInvalidNetwork, ErrorUnexpectedResult } from './errors'
import NetworkContext from './utils/NetworkContext'
import GraphqlClient from './GraphqlClient'
import {
  QUERY_DAO,
  QUERY_DAOS,
  QUERY_REGISTRY_ENTRY,
  QUERY_REGISTRY_ENTRIES,
  QUERY_QUEUE,
  QUERY_QUEUES,
  QUERY_QUEUES_BY_DAO,
} from './thegraph-queries'

export type GovernCoreConfig = {
  network: Networkish
  subgraphUrl?: string
  verbose?: boolean
}

class GovernCore {
  #gql: GraphqlClient
  readonly config: GovernCoreConfig
  readonly networkContext: NetworkContext

  constructor(config: GovernCoreConfig) {
    this.config = config
    this.networkContext = NetworkContext.from(
      config.network,
      config.subgraphUrl
    )

    if (!this.networkContext.subgraphUrl) {
      throw new ErrorInvalidNetwork(
        `A subgraphUrl couldn’t be found for the chain ID ${this.networkContext.chainId}. ` +
          `Please specify a subgraphUrl or use a supported chainId.`
      )
    }

    this.#gql = new GraphqlClient(this.networkContext.subgraphUrl, {
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

  async dao(name: string): Promise<DaoData | null> {
    const result = await this.fetchResult<{
      registryEntries: RegistryEntryData[] | null
    }>(
      [QUERY_DAO, { name }],
      `Unexpected result when fetching the dao ${name}.`
    )
    return result.registryEntries?.[0]?.executor ?? null
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
      governQueue: GovernQueueData | null
    }>(
      [QUERY_QUEUE, { queue: address.toLowerCase() }],
      `Unexpected result when fetching the queue ${address}.`
    )
    return result.governQueue ?? null
  }

  async queues(): Promise<GovernQueueData[]> {
    const result = await this.fetchResult<{
      governQueues: GovernQueueData[]
    }>([QUERY_QUEUES], `Unexpected result when fetching the queue.`)
    return result.governQueues ?? []
  }

  async registryEntry(name: string): Promise<RegistryEntryData | null> {
    const result = await this.fetchResult<{
      registryEntry: RegistryEntryData | null
    }>(
      [QUERY_REGISTRY_ENTRY, { name }],
      `Unexpected result when fetching the registry entry ${name}.`
    )
    return result.registryEntry ?? null
  }

  async registryEntries(): Promise<RegistryEntryData[]> {
    const result = await this.fetchResult<{
      registryEntries: RegistryEntryData[]
    }>(
      [QUERY_REGISTRY_ENTRIES],
      `Unexpected result when fetching the registry entries.`
    )
    return result.registryEntries ?? []
  }

  async queuesForDao(name: string): Promise<GovernQueueData[]> {
    const result = await this.fetchResult<{
      registryEntries: RegistryEntryData[]
    }>(
      [QUERY_QUEUES_BY_DAO, { name }],
      `Unexpected result when fetching the queues for dao ${name}.`
    )
    const queue = result.registryEntries?.[0]?.queue
    return queue ? [queue] : []
  }
}

export default GovernCore
