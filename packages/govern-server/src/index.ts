import { GovernLib } from '@aragon/govern-lib'
import env from './env'
import startGraphql from './api-graphql'

async function main() {
  const govern = new GovernLib({
    network: {
      chainId: env.chainId,
      ensAddress: env.ensAddress,
      name: env.networkName,
    },
    subgraphUrl: env.subgraphUrl,
  })

  const { url: graphqlUrl } = await startGraphql({
    govern,
    httpPort: env.graphqlHttpPort,
  })

  console.log()
  console.log(`GraphQL API listening on ${graphqlUrl}`)
}

main()
