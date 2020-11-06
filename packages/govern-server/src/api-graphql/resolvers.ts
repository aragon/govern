import { IResolvers } from 'apollo-server'
import { GovernLib } from '@aragon/govern-lib'

export default function resolvers(govern: GovernLib): IResolvers {
  return {
    Query: {
      async dao(_, args) {
        return govern.dao(args.name)
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
          parent.registryEntries
            .map(async ({ id }: { id: string }) => {
              const entry = await govern.registryEntry(id)
              return entry
                ? {
                    ...entry,
                    executor: govern.dao(entry.executor.address),
                  }
                : null
            })
            .filter(Boolean)
        )
      },
      async queues(parent) {
        return govern.queuesForDao(parent.name)
      },
    },
    RegistryEntry: {
      async executor(parent) {
        return govern.queuesForDao(parent.name)
      },
    },
  }
}
