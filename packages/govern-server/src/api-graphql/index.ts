import { ApolloServer, gql } from 'apollo-server'
import { Dao, dao, daos } from '../core'

type Configuration = { httpPort: number }

const resolvers = {
  Query: {
    async daos() {
      const _daos = await daos()
      return _daos.map((dao: Dao) => ({ ...dao, id: dao.address }))
    },
  },
}

const typeDefs = gql`
  type Dao {
    id: ID!
    address: String
  }
  type Query {
    daos: [Dao]
  }
`

export default async function start({ httpPort = 3000 }: Configuration) {
  const server = new ApolloServer({ typeDefs, resolvers })
  return server.listen(httpPort)
}
