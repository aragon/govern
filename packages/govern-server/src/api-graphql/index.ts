import { ApolloServer } from 'apollo-server'
import { GovernLib } from '@aragon/govern-lib'
import resolvers from './resolvers'
import typeDefs from './schema'

type Configuration = {
  govern: GovernLib
  httpPort: number
}

export default async function start({ govern, httpPort }: Configuration) {
  const server = new ApolloServer({
    resolvers: resolvers(govern),
    typeDefs,
  })
  return server.listen(httpPort)
}
