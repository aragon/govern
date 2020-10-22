import React, { createContext, useContext, useMemo } from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet, Wallet } from 'use-wallet'
import { useChainId } from './ChainId'
import { getUseWalletConnectors } from '../lib/web3-utils'

type WalletAugmentedContextProps = {
  wallet: Wallet<any>
  ethers: any
} | null

const WalletAugmentedContext = createContext<WalletAugmentedContextProps>(null)

function useWalletAugmented() {
  const walletContext = useContext(WalletAugmentedContext)
  if (!walletContext) {
    throw new Error(
      'useWalletAugmented can only be used inside a WalletProvider',
    )
  }

  return walletContext
}

type WalletAugmentedProps = {
  children: React.ReactNode
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }: WalletAugmentedProps) {
  const wallet: Wallet<any> = useWallet()
  const { ethereum } = wallet

  const ethers = useMemo(
    () => (ethereum ? new EthersProviders.Web3Provider(ethereum) : null),
    [ethereum],
  )

  const contextValue = useMemo(() => ({ wallet, ethers }), [wallet, ethers])

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

type WalletProviderProps = {
  children: React.ReactNode
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const { chainId } = useChainId()

  return (
    <UseWalletProvider chainId={chainId} connectors={getUseWalletConnectors()}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}
/* eslint-disable react/prop-types */

export { useWalletAugmented as useWallet }
