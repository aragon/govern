// rinkeby
const CHAIN_ID_DEFAULT = 4

const ENV_VARS = {
  CHAIN_ID() {
    // @ts-ignore
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? CHAIN_ID_DEFAULT : chainId
  },
  ENABLE_SENTRY() {
    return process.env.REACT_APP_ENABLE_SENTRY === '1'
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  PORTIS_DAPP_ID() {
    return process.env.REACT_APP_PORTIS_DAPP_ID || ''
  },
  SENTRY_DSN() {
    const dsn = process.env.REACT_APP_SENTRY_DSN || ''
    return dsn.trim()
  },
  SUBGRAPH_HTTP_ENDPOINT() {
    return process.env.REACT_APP_SUBGRAPH_HTTP_ENDPOINT || ''
  },
}

export default function env(name: string) {
  // @ts-ignore
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
