import registryEntry, { RegistryEntry } from '../fragments/registry-entry'

export interface Dao {
  id: string,
  metadata: string,
  address: string,
  registryEntries: RegistryEntry[]
}

export interface Executor {
  executor: Dao
}

const dao: string = `
    query DAO($name: String!) {
      executors: registryEntries(where: { name: $name }, first: 1) {
        executor {
           id
           address
           metadata
           registryEntries {
               ...RegistryEntry_registryEntry
           }
        }
      }
    }
    ${registryEntry}
  `

export default dao
