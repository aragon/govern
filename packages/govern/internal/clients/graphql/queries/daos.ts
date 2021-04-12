import daoFragment from '../fragments/dao-entry'

const daosQuery: string = `
   query DAOS {
      daos {
        ...daoFragment
      }
   }
   ${daoFragment}
`

export default daosQuery
