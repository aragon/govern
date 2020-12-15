import env from '../environment'

export const DEFAULT_LOCAL_CHAIN = 'private'
export const ETH_ZERO_ADDRESS = `0x${''.padEnd(42, '0')}`
export const ETH_ANY_ADDRESS = '0xffffffffffffffffffffffffffffffffffffffff'
export const ETH_EMPTY_HEX = '0x'

/**
 * Check address equality without checksums
 * @param {string} first First address
 * @param {string} second Second address
 * @returns {boolean} Address equality
 */
export function addressesEqual(first: string, second: string): boolean {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

// Identifiers representing networks. Useful for URLs for example.
// See getNetworkId() and chainIdFromNetworkId().
const NETWORK_IDS = new Map([
  [1, 'mainnet'],
  [4, 'rinkeby'],
  [100, 'xdai'],
])
export function getNetworkId(chainId: number): string | undefined {
  return NETWORK_IDS.get(chainId)
}
export function chainIdFromNetworkId(networkId: string): number | undefined {
  for (const [chainId, _networkId] of NETWORK_IDS.entries()) {
    if (_networkId === networkId) {
      return chainId
    }
  }
  return undefined
}

// An name describing a given network. Useful when displaying networks in UI.
export function getNetworkName(chainId: number): string {
  if (chainId === 1) return 'mainnet'
  if (chainId === 4) return 'rinkeby'
  if (chainId === 100) return 'xDai'
  return 'Unknown'
}

// Network names as defined by Ethers.js. Used to interact with Ethers.js only.
export function getNetworkEthersName(chainId: number): string | undefined {
  if (chainId === 1) return 'homestead'
  if (chainId === 3) return 'ropsten'
  if (chainId === 4) return 'rinkeby'
  return undefined
}

export function getNetworkNode(
  chainId: number = env('CHAIN_ID'),
): string | undefined {
  if (chainId === 1) return 'https://mainnet.eth.aragon.network/'
  if (chainId === 4) return 'https://rinkeby.eth.aragon.network/'
  return undefined
}

type UseWalletConf = unknown
type UseWalletProvider = {
  id: string
  useWalletConf?: UseWalletConf
}
type UseWalletConnectors = {
  [key: string]: UseWalletConf
}

export function getUseWalletProviders(): UseWalletProvider[] {
  const providers = [{ id: 'injected' }, { id: 'frame' }] as UseWalletProvider[]

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    })
  }

  if (env('PORTIS_DAPP_ID')) {
    providers.push({
      id: 'portis',
      useWalletConf: { dAppId: env('PORTIS_DAPP_ID') },
    })
  }

  return providers
}

export function getUseWalletConnectors(): UseWalletConnectors {
  return getUseWalletProviders().reduce<UseWalletConnectors>(
    (connectors, provider) => {
      if (provider.useWalletConf) {
        connectors[provider.id] = provider.useWalletConf
      }
      return connectors
    },
    {},
  )
}

/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
export function shortenAddress(address: string, charsLength = 4): string {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }

  return (
    address.slice(0, charsLength + prefixLength) +
    '...' +
    address.slice(-charsLength)
  )
}
