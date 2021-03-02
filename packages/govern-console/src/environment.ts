const CHAIN_ID_DEFAULT = 4

type EnvVarHelpers = {
  CHAIN_ID: () => number
  ENABLE_SENTRY: () => boolean
  FORTMATIC_API_KEY: () => string
  MAINNET_SUBGRAPH_URL: () => string
  PORTIS_DAPP_ID: () => string
  RINKEBY_SUBGRAPH_URL: () => string
  SENTRY_DSN: () => string
  SUBGRAPH_HTTP_ENDPOINT: () => string
}

const ENV_VARS: EnvVarHelpers = {
  CHAIN_ID(): number {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4')
    return isNaN(chainId) ? CHAIN_ID_DEFAULT : chainId
  },
  ENABLE_SENTRY(): boolean {
    return process.env.REACT_APP_ENABLE_SENTRY === '1'
  },
  FORTMATIC_API_KEY(): string {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  MAINNET_SUBGRAPH_URL(): string {
    return (
      process.env.MAINNET_SUBGRAPH_URL ||
      // Setting a sensible default as a fallback, as the subgraph is the backbone
      // of the app
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet'
    )
  },
  PORTIS_DAPP_ID(): string {
    return process.env.REACT_APP_PORTIS_DAPP_ID || ''
  },
  RINKEBY_SUBGRAPH_URL(): string {
    return (
      process.env.REACT_APP_RINKEBY_SUBGRAPH_URL ||
      // Setting a sensible default as a fallback, as the subgraph is the backbone
      // of the app
      'https://api.thegraph.com/subgraphs/name/evalir/aragon-govern-rinkeby'
    )
  },
  SENTRY_DSN(): string {
    const dsn = process.env.REACT_APP_SENTRY_DSN || ''
    return dsn.trim()
  },
  SUBGRAPH_HTTP_ENDPOINT(): string {
    return process.env.REACT_APP_SUBGRAPH_HTTP_ENDPOINT || ''
  },
}

export default function env<T extends keyof EnvVarHelpers>(
  name: T,
): ReturnType<EnvVarHelpers[T]> {
  return ENV_VARS[name]() as ReturnType<EnvVarHelpers[T]>
}
