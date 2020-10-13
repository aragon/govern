import React, { useCallback, useEffect } from 'react'
import { ChainUnsupportedError } from 'use-wallet'
import 'styled-components/macro'
import { useChainId } from '../../Providers/ChainId'
import { useWallet } from '../../Providers/Wallet'
import { shortenAddress, getNetworkName } from '../../lib/web3-utils'

function Header() {
  const { chainId, setChainId } = useChainId()
  const { wallet } = useWallet()

  const handleWalletConnection = useCallback(() => {
    wallet.status === 'connected' ? wallet.reset() : wallet.connect('injected')
  }, [wallet])

  const handleChangeChain = useCallback(e => setChainId(e.target.value), [
    setChainId,
  ])

  useEffect(() => {
    if (wallet!.error && wallet!.error instanceof ChainUnsupportedError) {
      alert(
        `Wrong network. Please connect to the ${getNetworkName(
          chainId,
        )} network.`,
      )
    }
  }, [chainId, wallet])

  return (
    <header
      css={`
        display: flex;
        justify-content: center;
        width: 100%;
        border: 1px solid whitesmoke;
        padding: 8px;
      `}
    >
      <h1
        css={`
          flex-grow: 1;
          font-weight: bold;
          font-size: 24px;
          text-decoration: underline;
        `}
      >
        Govern Console
      </h1>
      <label
        css={`
          margin-right: 16px;
        `}
      >
        Chain ID
        <select value={chainId} onChange={handleChangeChain}>
          <option value={1}>Mainnet</option>
          <option value={4}>Rinkeby</option>
        </select>
      </label>
      <button
        onClick={handleWalletConnection}
        css={`
          font-family: 'Overpass Mono', monospace;
          font-size: 12px;
          position: relative;
          background: transparent;
          color: white;
          cursor: pointer;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          &:active {
            top: 1px;
          }
        `}
      >
        {wallet.status === 'connected'
          ? shortenAddress(wallet.account!)
          : 'Connect to web3'}
      </button>
    </header>
  )
}

export default Header
