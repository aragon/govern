import { Address, Networkish, Network } from '../types'
import { networkContexts } from '../config'
import { ErrorInvalidNetwork } from '../errors'

class NetworkContext implements Network {
  readonly chainId: number
  readonly ensAddress: Address
  readonly name: string
  readonly subgraphUrl: string

  static chainIdFromName(name: string): number | undefined {
    for (const [chainId, networkContext] of networkContexts.entries()) {
      if (networkContext.name === name) {
        return chainId
      }
    }
    return undefined
  }

  static from(network: Networkish, subgraphUrl?: string): NetworkContext {
    if (!network) {
      throw new ErrorInvalidNetwork(`Network: incorrect value provided.`)
    }

    if (typeof network === 'string') {
      return new NetworkContext({ name: network, subgraphUrl })
    }

    if (typeof network === 'number') {
      return new NetworkContext({ chainId: network, subgraphUrl })
    }

    return new NetworkContext({ ...network, subgraphUrl })
  }

  constructor({
    chainId,
    ensAddress,
    name,
    subgraphUrl,
  }: {
    chainId?: number
    ensAddress?: Address
    name?: string
    subgraphUrl?: string
  }) {
    // Only for TS to accept the following expression: `this.chainId ?? chainId`
    this.chainId = -1

    if (name === undefined && chainId === undefined) {
      throw new ErrorInvalidNetwork(
        `Network: no name or chainId passed. ` +
          `Please provide at least one of these.`
      )
    }

    // Handle the case of having a name but no chainId.
    if (name !== undefined && chainId === undefined) {
      const _chainId = NetworkContext.chainIdFromName(name)

      if (_chainId === undefined) {
        throw new ErrorInvalidNetwork(
          `Network: invalid name provided: ${name}. ` +
            `Please use provide a chainId or use one of the following names: ` +
            [...networkContexts.values()].map((c) => c.name).join(', ') +
            `.`
        )
      }

      this.chainId = _chainId
    }

    const chainIdNetworkContext = networkContexts.get(
      (this.chainId === -1 ? chainId : this.chainId) ?? -1
    )

    // Unsupported chain IDs are accepted, but only if
    // ensAddress and subgraphUrl are both provided.
    if (!chainIdNetworkContext && !(ensAddress && subgraphUrl)) {
      throw new ErrorInvalidNetwork(
        `Network: unsupported chainId provided: ${chainId}. ` +
          `Please also provide a subgraphUrl and an ensAddress, ` +
          `or pick a chainId from this list: ` +
          [...networkContexts.keys()].join(', ') +
          `.`
      )
    }

    if (this.chainId === undefined) {
      this.chainId = chainId as number
    }

    this.name = name ?? chainIdNetworkContext?.name ?? 'Unknown'
    this.ensAddress = (ensAddress ??
      chainIdNetworkContext?.ensAddress) as string
    this.subgraphUrl = (subgraphUrl ??
      chainIdNetworkContext?.subgraphUrl) as string
  }
}

export default NetworkContext
