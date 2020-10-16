import { ApolloServer, gql } from 'apollo-server'
import GovernData from '../core/data'
import resolvers from './resolvers'
import typeDefs from './schema'

type Configuration = {
  govern: GovernData
  httpPort: number
}

export default async function start({ govern, httpPort }: Configuration) {
  const server = new ApolloServer({
    resolvers: resolvers(govern),
    typeDefs,
  })
  return server.listen(httpPort)
}
