function graphqlHttpPort(): number {
  const port = parseInt(process.env.GVN_GRAPHQL_HTTP_PORT as string, 10)
  return isNaN(port) ? 3000 : port
}

function chainId(): number {
  const chainId = parseInt(process.env.GVN_CHAIN_ID as string, 10)
  return isNaN(chainId) ? 4 : chainId
}

export default {
  chainId: chainId(),
  graphqlHttpPort: graphqlHttpPort(),
}
