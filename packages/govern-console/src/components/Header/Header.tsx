import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ChainUnsupportedError } from 'use-wallet'
import 'styled-components/macro'
import Button from '../Button'
import { useChainId } from '../../Providers/ChainId'
import { useWallet } from '../../Providers/Wallet'
import { shortenAddress, getNetworkName } from '../../lib/web3-utils'
import AragonSvg from '../../assets/aragon-metal.svg'

function Header(): JSX.Element {
  const { chainId, updateChainId } = useChainId()
  const { wallet } = useWallet()
  const history = useHistory()

  useEffect(() => {
    if (wallet.error && wallet.error instanceof ChainUnsupportedError) {
      alert(
        `Wrong network. Please connect to the ${getNetworkName(
          chainId,
        )} network.`,
      )
    }
  }, [chainId, wallet])

  const handleChangeChain = useCallback(
    (event: { target: { value: string } }) => {
      const chainId = Number(event.target.value)

      updateChainId(chainId)

      // When we change the chain ID, the DAO might not exist,
      // so we must revert back to the DAO selection screen.
      history.push(`/${getNetworkName(chainId)}`)
    },
    [history, updateChainId],
  )

  const handleGoToHome = useCallback(() => history.push('/'), [history])

  const handleWalletConnection = useCallback(() => {
    wallet.status === 'connected' ? wallet.reset() : wallet.connect('injected')
  }, [wallet])

  return (
    <header
      css={`
        display: flex;
        justify-content: space-between;
        width: 100%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        padding: 8px;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <button
          type="button"
          onClick={handleGoToHome}
          css={`
            display: flex;
            background: transparent;
            border: 0px;
            &:hover {
              cursor: pointer;
            }
            &:active {
              position: relative;
              top: 1px;
            }
          `}
        >
          <img src={AragonSvg} width="36" alt="" />
          <h1
            css={`
              flex-grow: 1;
              font-size: 24px;
              margin-left: 8px;
            `}
          >
            Govern Console
          </h1>
        </button>
      </div>
      <div>
        <label
          css={`
            margin-right: 16px;
            margin-top: 8px;
          `}
        >
          Chain ID
          <select
            value={chainId}
            onChange={handleChangeChain}
            css={`
              color: black;
            `}
          >
            <option value={1}>Mainnet</option>
            <option value={4}>Rinkeby</option>
          </select>
        </label>
        <Button
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
            ? shortenAddress(wallet?.account ?? '')
            : 'Connect account'}
        </Button>
      </div>
    </header>
  )
}

export default Header
