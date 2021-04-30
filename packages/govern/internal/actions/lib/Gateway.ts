import { providers } from 'ethers'
import { BRIGE_CONFIG } from '../../configuration/ConfigDefaults'
import { GatewayPool } from 'dvote-js'

export async function getPool(provider?: providers.Provider): Promise<GatewayPool> {
  const network = provider? await provider.getNetwork(): null
  const networkId: string = network?.name || 'rinkeby'
  const options = BRIGE_CONFIG[networkId]
  const pool = await GatewayPool.discover(options)
  return pool
}

