import React, { createContext, useContext, useMemo } from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet, Wallet } from 'use-wallet'
import { useChainId } from './ChainId'
import { getNetworkNode, getUseWalletConnectors } from '../lib/web3-utils'

export type WalletAugmentedData = {
  wallet: Wallet<any>
  ethers: any
}

const WalletAugmentedContext = createContext<WalletAugmentedData | null>(null)

export function useWalletAugmented(): WalletAugmentedData {
  const walletContext = useContext(WalletAugmentedContext)
  if (!walletContext) {
    throw new Error(
      'useWalletAugmented can only be used inside a WalletProvider',
    )
  }
  return walletContext
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const wallet: Wallet<any> = useWallet()
  const { ethereum } = wallet
  const { chainId } = useChainId()

  const ethers = useMemo(
    () =>
      ethereum
        ? new EthersProviders.Web3Provider(ethereum)
        : new EthersProviders.JsonRpcProvider(getNetworkNode(chainId)),
    [chainId, ethereum],
  )

  const contextValue = useMemo(() => ({ wallet, ethers }), [wallet, ethers])

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const { chainId } = useChainId()

  return (
    <UseWalletProvider chainId={chainId} connectors={getUseWalletConnectors()}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}
/* eslint-disable react/prop-types */

export { useWalletAugmented as useWallet }
