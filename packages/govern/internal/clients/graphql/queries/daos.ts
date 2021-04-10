import daoEntry, { Dao } from '../fragments/dao-entry'

export type Daos = Dao[]

const daosQuery: string = `
   query DAOS {
      daos {
         ...daoEntry
      }
   }
   ${daoEntry}
`

export default daosQuery
