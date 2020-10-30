import env from './env'
import startGraphql from './api-graphql'
import { GovernCore } from './core'

async function main() {
  const govern = new GovernCore({ network: 1 })

  const { url: graphqlUrl } = await startGraphql({
    govern,
    httpPort: env.graphqlHttpPort,
  })

  console.log()
  console.log(`GraphQL API listening on ${graphqlUrl}`)
}

main()
