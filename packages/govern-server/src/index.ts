import { graphqlHttpPort } from './env'
import startGraphql from './api-graphql'

async function main() {
  const _graphqlHttpPort = graphqlHttpPort()
  const { url } = await startGraphql({ httpPort: _graphqlHttpPort })
  console.log()
  console.log(`GraphQL API listening on ${url}`)
}

main()
