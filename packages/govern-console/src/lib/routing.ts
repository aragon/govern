import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useChainId } from './chain-id'
import { getNetworkId } from './web3-utils'

type RoutingData = {
  goHome: () => void
}

export function useRouting(): RoutingData {
  const history = useHistory()
  const { chainId } = useChainId()

  const goHome = useCallback(() => {
    const path = `/${getNetworkId(chainId)}`
    if (history.location.pathname !== path) {
      history.push(path)
    }
  }, [chainId, history])

  return { goHome }
}
