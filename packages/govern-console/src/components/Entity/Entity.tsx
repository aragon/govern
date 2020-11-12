import React from 'react'
import 'styled-components/macro'
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

export default function Entity({
  address,
  shorten = false,
  type,
}: EntityProps) {
  const { chainId } = useChainId()
  return (
    <a
      href={composeEtherscanLink(address, chainId, type)}
      rel="noopener noreferrer"
      target="_blank"
    >
      {shorten ? shortenAddress(address) : address}
    </a>
  )
}
