import { ErrorInvalidNetwork, ErrorUnexpectedResult } from '../errors'
import { toNetwork } from '../utils'
import { Address, Network, Networkish, QueryResult } from '../types'
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
        `The chainId ${this.network.chainId} is not supported by the TheGraph connector.`
      )
    }

    this.#gql = new TheGraphWrapper(orgSubgraphUrl, {
      verbose: config.verbose,
    })
  }

  async dao(address: Address): Promise<QueryResult> {
    try {
      return this.#gql.performQuery(queries.DAO, {
        dao: address.toLowerCase(),
      })
    } catch (err) {
      throw new ErrorUnexpectedResult(
        `Unexpected result when fetching the dao ${address}.`
      )
    }
  }

  async daos(): Promise<QueryResult> {
    try {
      return this.#gql.performQuery(queries.DAOS)
    } catch (err) {
      throw new ErrorUnexpectedResult(
        `Unexpected result when fetching the daos.`
      )
    }
  }

  async queue(address: Address): Promise<QueryResult> {
    try {
      return this.#gql.performQuery(queries.QUEUE, {
        queue: address.toLowerCase(),
      })
    } catch (err) {
      throw new ErrorUnexpectedResult(
        `Unexpected result when fetching the queue ${address}.`
      )
    }
  }

  async queues(): Promise<QueryResult> {
    try {
      return this.#gql.performQuery(queries.QUEUES)
    } catch (err) {
      throw new ErrorUnexpectedResult(
        `Unexpected result when fetching the queue.`
      )
    }
  }

  async game(name: string): Promise<QueryResult> {
    try {
      return this.#gql.performQuery(queries.GAME, {
        name,
      })
    } catch (err) {
      throw new ErrorUnexpectedResult(
        `Unexpected result when fetching the game ${name}.`
      )
    }
  }

  async games(): Promise<QueryResult> {
    try {
      return this.#gql.performQuery(queries.GAMES)
    } catch (err) {
      throw new ErrorUnexpectedResult(
        `Unexpected result when fetching the games.`
      )
    }
  }

  async queuesForDao(dao: Address): Promise<QueryResult> {
    try {
      return this.#gql.performQuery(queries.QUEUES_BY_DAO, {
        dao: dao.toString(),
      })
    } catch (err) {
      throw new ErrorUnexpectedResult(
        `Unexpected result when fetching the queues for dao ${dao}.`
      )
    }
  }
}

export default ConnectorTheGraph
