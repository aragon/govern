import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from 'react'

type ChainIdData = {
  chainId: number
  updateChainId: (chainId: number) => void
}

const CHAIN_ID_KEY = 'ARAGON_CONSOLE_CHAIN_ID'

const ChainIdContext = createContext<ChainIdData | null>(null)

function loadChainId(): number {
  const id = Number(localStorage.getItem(CHAIN_ID_KEY))

  // Default to rinkeby if there is no chain id stored
  if (isNaN(id) || id <= 0) {
    return 4
  }

  return id
}

function saveChainId(chainId: number): void {
  localStorage.setItem(CHAIN_ID_KEY, String(chainId))
}

export function useChainId(): ChainIdData {
  const chainIdContext = useContext(ChainIdContext)

  if (!chainIdContext) {
    throw new Error('useChainId can only be used inside a ChainIdProvider')
  }

  return chainIdContext
}

export default function ChainIdProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [chainId, setChainId] = useState<number>(loadChainId())

  const updateChainId = useCallback(chainId => {
    setChainId(chainId)
    saveChainId(chainId)
  }, [])

  const contextValue = useMemo(() => ({ chainId, updateChainId }), [
    chainId,
    updateChainId,
  ])

  return (
    <ChainIdContext.Provider value={contextValue}>
      {children}
    </ChainIdContext.Provider>
  )
}
