import env from './env'
import startGraphql from './api-graphql'
import GovernData from './core/data'

async function main() {
  const govern = new GovernData({ network: 4 })

  const { url: graphqlUrl } = await startGraphql({
    govern,
    httpPort: env.graphqlHttpPort,
  })

  console.log()
  console.log(`GraphQL API listening on ${graphqlUrl}`)
}

main()
