import { Dao } from './dao'
import registryEntry from '../fragments/registry-entry'

export interface Daos {
  daos: Dao[]
}

const daos: string = `
   query DAOS {
      daos {
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

export default daos
