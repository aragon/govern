import React from 'react'
import WalletProvider from './Wallet'
import PermissionsProvider from './Permissions'

export default function GeneralProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <WalletProvider>
      <PermissionsProvider>{children}</PermissionsProvider>
    </WalletProvider>
  )
}
