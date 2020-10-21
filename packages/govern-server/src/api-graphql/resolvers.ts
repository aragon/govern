import { IResolvers } from 'apollo-server'
import { GovernCore } from '../core'

export default function resolvers(govern: GovernCore): IResolvers {
  return {
    Query: {
      async dao(_, args) {
        return govern.dao(args.address)
      },
      async daos() {
        return govern.daos()
      },
      async game(_, args) {
        return govern.game(args.name)
      },
    },
    Dao: {
      async games(parent) {
        return Promise.all(
          parent.games.map(async ({ id }: { id: string }) => govern.game(id))
        )
      },
      async queues(parent) {
        return govern.queuesForDao(parent.address)
      },
    },
  }
}
