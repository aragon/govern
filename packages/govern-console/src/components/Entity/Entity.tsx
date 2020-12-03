import React from 'react'
import 'styled-components/macro'
import { cid as isCid } from 'is-ipfs'
import { hexToUtf8, isAddress } from 'web3-utils'
import { useChainId } from '../../Providers/ChainId'
import { shortenAddress } from '../../lib/web3-utils'
import { RINKEBY } from '../../lib/known-chains'

type EntityProps = {
  address: string
  type: 'address' | 'tx'
  shorten?: boolean
}

function composeEtherscanLink(
  address: string,
  chainId: number,
  type: string,
): string {
  return `https://${
    chainId === RINKEBY ? 'rinkeby.' : ''
  }etherscan.io/${type}/${address}`
}

function composeIpfsLink(cid: string): string {
  return `https://ipfs.fleek.co/ipfs/${cid}`
}

function detectAndComposeLinkType(
  hash: string,
  chainId: number,
  type: string,
): string[] {
  try {
    if (isAddress(hash)) {
      return [composeEtherscanLink(hash, chainId, type), 'ethereum']
    }

    if (isCid(hexToUtf8(hash))) {
      return [composeIpfsLink(hexToUtf8(hash)), 'ipfs']
    }
  } catch (err) {
    return ['', '']
  }

  return ['', '']
}

function formatAddress(
  address: string,
  { shorten }: { shorten: boolean },
): string {
  try {
    if (isAddress(address)) {
      return shorten ? shortenAddress(address) : address
    }

    if (isCid(hexToUtf8(address))) {

      return hexToUtf8(address)
    }
  } catch (err) {
    // Won't be a valid string anyway, so we return it
    return address.length > 42 ? `${address.slice(0, 43)}...` : address
  }

  // In this case, it's possible that it's really just plain text, so we decode it anyways.
  return hexToUtf8(address)
}

export default function Entity({
  address,
  shorten = false,
  type,
}: EntityProps) {
  const { chainId } = useChainId()
  const [url] = detectAndComposeLinkType(address, chainId, type)
  return url ? (
    <a href={url} rel="noopener noreferrer" target="_blank">
      {formatAddress(address, { shorten })}
    </a>
  ) : (
    <span>{address.length > 42 ? `${address.slice(0, 43)}...` : address}</span>
  )
}
