import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { useWalletAugmented } from './Wallet'
import { addressesEqual, ETH_ANY_ADDRESS } from '../lib/web3-utils'
import { KNOWN_QUEUE_ROLES } from '../lib/known-roles'

type Permissions = {
  execute: boolean
  schedule: boolean
  veto: boolean
  challenge: boolean
}

type PermissionsData = {
  permissions: Permissions
  populatePermissions: (rawRoles: Role[]) => void
}

function isPermissionsKey(value: unknown): value is keyof Permissions {
  return (
    value === 'execute' ||
    value === 'schedule' ||
    value === 'veto' ||
    value === 'challenge'
  )
}

const PermissionsContext = createContext<PermissionsData | null>(null)

export function usePermissions(): PermissionsData {
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

function permissionsFromRoles(
  account: string,
  roles: Role[],
  permissions: Permissions = {
    execute: false,
    schedule: false,
    veto: false,
    challenge: false,
  },
): Permissions {
  return roles.reduce(
    (permissions: Permissions, role: Role) => {
      const anyOrCurrentAccount =
        addressesEqual(role.who, ETH_ANY_ADDRESS) ||
        addressesEqual(role.who, account)

      if (!anyOrCurrentAccount) {
        return permissions
      }

      const roleName = KNOWN_QUEUE_ROLES.get(role.selector)
      if (roleName && isPermissionsKey(roleName)) {
        permissions[roleName] = true
      }
      return permissions
    },
    { ...permissions },
  )
}

function permissionsReducer(permissions, { account, roles }) {
  return permissionsFromRoles(account, roles, permissions)
}

export default function PermissionsProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [permissions, dispatchPermissions] = useReducer<Permissions>(
    permissionsReducer,
    { execute: false, schedule: false, veto: false, challenge: false },
  )

  const { wallet } = useWalletAugmented()
  const { account } = wallet

  const populatePermissions = useCallback(
    (roles: Role[]) => {
      dispatchPermissions({ account: account ?? '', roles })
    },
    [account],
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
