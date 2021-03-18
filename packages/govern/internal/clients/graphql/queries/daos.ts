import { Dao } from './dao'
import registryEntry from '../fragments/registry-entry'

export type Daos = Dao[]

const daos: string = `
   query DAOS {
      governs {
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
