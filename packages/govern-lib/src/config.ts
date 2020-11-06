import { ChainId, Network } from './types'

export const networkContexts = new Map<
  ChainId,
  Network & { subgraphUrl: string }
>([
  [
    1,
    {
      chainId: 1,
      name: 'ethereum',
      ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      subgraphUrl:
        'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-govern-mainnet',
    },
  ],
  [
    4,
    {
      chainId: 4,
      name: 'rinkeby',
      ensAddress: '0x98df287b6c145399aaa709692c8d308357bc085d',
      subgraphUrl:
        'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-govern-rinkeby',
    },
  ],
])
