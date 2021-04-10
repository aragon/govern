import daoEntry from '../fragments/dao-entry'

const daoQuery: string = `
    query DAO($name: String!) {
      dao(id: $name) {
        ...daoEntry
      }
    }
    ${daoEntry}
  `

export default daoQuery
