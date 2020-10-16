import { IResolvers } from 'apollo-server'
import GovernData from '../core/data'

export default function resolvers(govern: GovernData): IResolvers {
  return {
    Query: {
      async dao(parent, args, context, info) {
        return govern.dao(args.address)
      },
      async daos() {
        try {
          const result = await govern.daos()
          return result?.data?.governs || []
        } catch (err) {
          return []
        }
      },
    },
  }
}
