import { ApolloServer, gql } from 'apollo-server'
import { GovernCore } from '../core'
import resolvers from './resolvers'
import typeDefs from './schema'

type Configuration = {
  govern: GovernCore
  httpPort: number
}

export default async function start({ govern, httpPort }: Configuration) {
  const server = new ApolloServer({
    resolvers: resolvers(govern),
    typeDefs,
  })
  return server.listen(httpPort)
}
