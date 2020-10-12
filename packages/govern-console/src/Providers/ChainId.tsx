import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from 'react'
import env from '../environment'

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
  const [chainId, setChainId] = useState(Number(env('CHAIN_ID')))

  const handleChangeChainId = useCallback(
    chainId => {
      setChainId(Number(chainId))
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
