import registryEntry, { RegistryEntry } from '../fragments/registry-entry'

export interface Dao {
  id: string,
  metadata: string,
  address: string,
  registryEntries: RegistryEntry[]
}

const dao: string = `
    query DAO($name: String!) {
      registryEntries(where: { name: $name }, first: 1) {
        id
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
