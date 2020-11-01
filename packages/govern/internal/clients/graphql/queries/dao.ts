import registryEntry, { RegistryEntry } from '../fragments/registry-entry'

export interface Dao {
  id: string,
  metadata: string,
  address: string,
  registryEntries: RegistryEntry[]
}

const dao: string = `
    query DAO($name: String) {
      dao(name: $name) {
        id
        address
        metadata
        registryEntries {
            ...RegistryEntry_registryEntry
        }
      }
    }
    ${registryEntry}
  `

export default dao
