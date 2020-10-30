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
      async registryEntry(_, args) {
        return govern.registryEntry(args.name)
      },
      async registryEntries(_, args) {
        return govern.registryEntries()
      },
    },
    Dao: {
      async registryEntries(parent) {
        return Promise.all(
          parent.registryEntries.map(async ({ id }: { id: string }) =>
            govern.registryEntry(id)
          )
        )
      },
      async queues(parent) {
        return govern.queuesForDao(parent.address)
      },
    },
  }
}
