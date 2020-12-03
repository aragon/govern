export const MAINNET_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet'
export const RINKEBY_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/evalir/aragon-govern-rinkeby'

export function log(...params: any[]) {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    console.log(...params)
  }
}
