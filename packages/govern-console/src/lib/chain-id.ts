import { useCallback, useMemo } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { chainIdFromNetworkId, getNetworkId } from './web3-utils'
import env from '../environment'

type ChainIdData = {
  chainId: number
  updateChainId: (chainId?: number) => void
}

export function useChainId(): ChainIdData {
  const history = useHistory()
  const route = useRouteMatch('/:network') as { params: { network: string } }
  const chainId = chainIdFromNetworkId(route?.params?.network ?? '') ?? -1

  const updateChainId = useCallback(
    (_chainId: number = env('CHAIN_ID')) => {
      if (_chainId !== chainId) {
        history.push(`/${getNetworkId(_chainId)}`)
      }
    },
    [chainId, history],
  )

  return useMemo(() => ({ chainId, updateChainId }), [chainId, updateChainId])
}
