import React from 'react'
import ChainIdProvider from './ChainId'
import WalletProvider from './Wallet'
import PermissionsProvider from './Permissions'

export default function GeneralProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <ChainIdProvider>
      <WalletProvider>
        <PermissionsProvider>{children}</PermissionsProvider>
      </WalletProvider>
    </ChainIdProvider>
  )
}
