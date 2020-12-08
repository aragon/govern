import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useWalletAugmented } from './Wallet'
import { addressesEqual, ETH_ANY_ADDRESS } from '../lib/web3-utils'
import { KNOWN_QUEUE_ROLES } from '../lib/known-roles'

type PermissionsObj = {
  execute: boolean
  schedule: boolean
  veto: boolean
  challenge: boolean
}

type PermissionsContextProps = {
  permissions: PermissionsObj
  populatePermissions: (rawRoles: any) => void
} | null

const PermissionsContext = createContext<PermissionsContextProps>(null)

export function usePermissions() {
  const permissionsContext = useContext(PermissionsContext)

  if (!permissionsContext) {
    throw new Error(
      'usePermissions can only be used inside a PermissionsProvider',
    )
  }

  return permissionsContext
}

type Role = {
  frozen: string
  selector: string
  who: string
}

type PermissionsProviderProps = {
  children: React.ReactNode
}

export default function PermissionsProvider({
  children,
}: PermissionsProviderProps) {
  const [permissions, setPermissions] = useState({
    execute: false,
    schedule: false,
    veto: false,
    challenge: false,
  })
  const { wallet } = useWalletAugmented()
  const { account } = wallet

  const populatePermissions = useCallback(
    (rawRoles: any) => {
      const newPermissions = permissions
      rawRoles.map((role: Role) => {
        if (
          addressesEqual(role.who, ETH_ANY_ADDRESS) ||
          addressesEqual(role.who, account ?? '')
        ) {
          const roleName = KNOWN_QUEUE_ROLES.get(role.selector) ?? ''
          if (roleName) {
            // @ts-ignore
            newPermissions[roleName] = true
          }
        }
      })
      setPermissions(newPermissions)
    },
    [account, permissions],
  )

  const contextValue = useMemo(
    () => ({
      permissions,
      populatePermissions,
    }),
    [permissions, populatePermissions],
  )

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  )
}
