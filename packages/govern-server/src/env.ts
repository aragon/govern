export function graphqlHttpPort(): number {
  const port = parseInt(process.env.GVN_GRAPHQL_HTTP_PORT as string, 10)
  return isNaN(port) ? 3000 : port
}
