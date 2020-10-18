import { IResolvers } from 'apollo-server'
import GovernData from '../core/data'

export default function resolvers(govern: GovernData): IResolvers {
  return {
    Query: {
      async dao(_, args) {
        try {
          const result = await govern.dao(args.address)
          return result?.data?.govern || null
        } catch (err) {
          return null
        }
      },
      async daos() {
        try {
          const result = await govern.daos()
          return result?.data?.governs || []
        } catch (err) {
          return []
        }
      },
      async game(_, args) {
        try {
          const result = await govern.game(args.name)
          return result?.data?.game || null
        } catch (err) {
          return null
        }
      },
    },
    Dao: {
      async games(parent) {
        try {
          return await Promise.all(
            parent.games.map(async ({ id }: { id: string }) => {
              const game = await govern.game(id)
              return game?.data?.optimisticGame
            })
          )
        } catch (err) {
          return []
        }
      },
    },
  }
}
