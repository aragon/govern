import { useChainId } from './chain-id'

type RoutingData = {
  goHome: () => void
}

export function useRouting(): RoutingData {
  const { updateChainId } = useChainId()

  // Calling updateChainId() without
  // parameters resets the chain ID.
  const goHome = () => updateChainId()

  return { goHome }
}
