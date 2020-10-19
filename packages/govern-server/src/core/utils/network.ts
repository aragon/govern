import { ErrorInvalidNetwork } from '../errors'
import { NETWORKS } from '../params'
import { Address, Network, Networkish } from '../types'

export function networkFromChainId(chainId: number): Network | null {
  return NETWORKS.find((network) => network.chainId === chainId) || null
}

export function networkFromName(name: string): Network | null {
  return NETWORKS.find((network) => network.name === name) || null
}

function networkFromObject({
  chainId,
  ensAddress,
  name,
}: {
  chainId?: number
  ensAddress?: Address
  name?: string
}): Network {
  if (name === undefined && chainId === undefined) {
    throw new ErrorInvalidNetwork(
      `Network: no name or chainId passed. ` +
        `Please provide at least one of these.`
    )
  }

  // Handle the case of having a name but no chainId.
  if (name !== undefined && chainId === undefined) {
    chainId = networkFromName(name)?.chainId

    if (chainId === undefined) {
      throw new ErrorInvalidNetwork(
        `Network: invalid name provided: ${name}. ` +
          `Please use provide a chainId or use one of the following names: ` +
          NETWORKS.map((network) => network.chainId).join(', ') +
          `.`
      )
    }
  }

  // Just a little help for TypeScript, at this
  // point we know that chainId cannot be undefined.
  chainId = chainId as number

  const chainIdNetwork = networkFromChainId(chainId)

  if (!chainIdNetwork) {
    throw new ErrorInvalidNetwork(
      `Network: invalid chainId provided: ${chainId}. ` +
        `Please use one of the following: ` +
        NETWORKS.map((network) => network.chainId).join(', ') +
        `.`
    )
  }

  // We compare with undefined to accept empty strings.
  if (name === undefined) {
    name = chainIdNetwork.name
  }

  if (!ensAddress) {
    ensAddress = chainIdNetwork.ensAddress
  }

  return { chainId, ensAddress, name }
}

export function toNetwork(network: Networkish): Network {
  if (!network) {
    throw new ErrorInvalidNetwork(`Network: incorrect value provided.`)
  }

  if (typeof network === 'string') {
    return networkFromObject({ name: network })
  }

  if (typeof network === 'number') {
    return networkFromObject({ chainId: network })
  }

  return networkFromObject(network)
}
