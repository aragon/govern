function chainId(): number {
  const chainId = parseInt(process.env.GVN_CHAIN_ID as string, 10)
  return isNaN(chainId) ? 4 : chainId
}

function ensAddress(): string | undefined {
  return (process.env.GVN_ENS_ADDRESS as string) || undefined
}

function graphqlHttpPort(): number {
  const port = parseInt(process.env.GVN_GRAPHQL_HTTP_PORT as string, 10)
  return isNaN(port) ? 3000 : port
}

function networkName(): string | undefined {
  return (process.env.GVN_NETWORK_NAME as string) || undefined
}

function subgraphUrl(): string | undefined {
  return (process.env.GVN_SUBGRAPH_URL as string) || undefined
}

export default {
  chainId: chainId(),
  ensAddress: ensAddress(),
  graphqlHttpPort: graphqlHttpPort(),
  networkName: networkName(),
  subgraphUrl: subgraphUrl(),
}
