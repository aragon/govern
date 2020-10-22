import React from 'react'
import ChainIdProvider from './ChainId'
import WalletProvider from './Wallet'

type GeneralProviderProps = {
  children: React.ReactNode
}

export default function GeneralProvider({ children }: GeneralProviderProps) {
  return (
    <ChainIdProvider>
      <WalletProvider>{children}</WalletProvider>
    </ChainIdProvider>
  )
}
