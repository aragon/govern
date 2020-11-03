import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from 'react'

const CHAIN_ID = 'ARAGON_CONSOLE_CHAIN_ID'

type ChainIdContextProps = {
  chainId: number
  setChainId: Function
} | null

const ChainIdContext = createContext<ChainIdContextProps>(null)

export function useChainId() {
  const chainIdContext = useContext(ChainIdContext)

  if (!chainIdContext) {
    throw new Error('useChainId can only be used inside a ChainIdProvider')
  }

  return chainIdContext
}

type ChainIdProviderProps = {
  children: React.ReactNode
}

export default function ChainIdProvider({ children }: ChainIdProviderProps) {
  const [chainId, setChainId] = useState(
    // Always default to rinkeby if there's no chain id cached
    Number(localStorage.getItem(CHAIN_ID)) || 4,
  )

  const handleChangeChainId = useCallback(
    chainId => {
      setChainId(Number(chainId))
      localStorage.setItem(CHAIN_ID, String(chainId))
    },
    [setChainId],
  )

  const contextValue = useMemo(
    () => ({
      chainId,
      setChainId: handleChangeChainId,
    }),
    [chainId, handleChangeChainId],
  )

  return (
    <ChainIdContext.Provider value={contextValue}>
      {children}
    </ChainIdContext.Provider>
  )
}
