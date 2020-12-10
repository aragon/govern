import env from '../environment'
import { BigNumber as EthersBigNumber } from 'ethers'
import { Wallet } from 'use-wallet'

export const DEFAULT_LOCAL_CHAIN = 'private'
export const ETH_FAKE_ADDRESS = `0x${''.padEnd(40, '0')}`
export const ETH_ANY_ADDRESS = '0xffffffffffffffffffffffffffffffffffffffff'
export const ETH_EMPTY_HEX = '0x'

const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g

export function bigNum(
  value: string | number | bigint | EthersBigNumber,
): EthersBigNumber {
  return EthersBigNumber.from(value)
}

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

export function getNetworkName(chainId: number): string {
  chainId = String(chainId)

  if (chainId === '1') return 'mainnet'
  if (chainId === '4') return 'rinkeby'
  if (chainId === '100') return 'xDai'

  return 'Unknown'
}

export function getNetworkType(chainId = env('CHAIN_ID')): string {
  chainId = String(chainId)

  if (chainId === '1') return 'main'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'

  return DEFAULT_LOCAL_CHAIN
}

export function getNetworkNode(chainId = env('CHAIN_ID')): string {
  chainId = String(chainId)

  if (chainId === '1') return 'https://mainnet.eth.aragon.network/'
  if (chainId === '4') return 'https://rinkeby.eth.aragon.network/'
}

export function getUseWalletProviders(): {
  id: string,
  useWalletConf?: unknown,
}[] {
  const providers = [{ id: 'injected' }, { id: 'frame' }]

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

export function getUseWalletConnectors(): {
  [k: string]: unknown,
} {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
}

export const addressPattern = '(0x)?[0-9a-fA-F]{40}'

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

export function sanitizeNetworkType(networkType: string): string {
  if (networkType === 'private') return 'localhost'
  if (networkType === 'main') return 'mainnet'
  return networkType
}

export function isLocalOrUnknownNetwork(chainId = env('CHAIN_ID')): boolean {
  return getNetworkType(chainId) === DEFAULT_LOCAL_CHAIN
}

// Detect Ethereum addresses in a string and transform each part.
//
// `callback` is called on every part with two params:
//   - The string of the current part.
//   - A boolean indicating if it is an address.
//
export function transformAddresses<T = unknown>(
  str: string,
  callback: (part: string, isAddress: boolean) => T,
): T[] {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) =>
      callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index),
    )
}

export async function signMessage(
  wallet: Wallet<any>,
  message: string,
): { signHash: string, error: boolean, errorMsg: Error } {
  let signHash
  let error = false
  let errorMsg

  try {
    signHash = await wallet.ethers.getSigner().signMessage(message)
  } catch (err) {
    error = true
    errorMsg = err
  }

  return { signHash, error, errorMsg }
}
