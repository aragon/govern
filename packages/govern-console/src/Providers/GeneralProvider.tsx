import React from 'react'
import ChainIdProvider from './ChainId'
import WalletProvider from './Wallet'
import PermissionsProvider from './Permissions'

type GeneralProviderProps = {
  children: React.ReactNode
}

export default function GeneralProvider({ children }: GeneralProviderProps) {
  return (
    <ChainIdProvider>
      <WalletProvider>
        <PermissionsProvider>{children}</PermissionsProvider>
      </WalletProvider>
    </ChainIdProvider>
  )
}
