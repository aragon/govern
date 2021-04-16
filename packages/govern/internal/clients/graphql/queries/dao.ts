import daoFragment from '../fragments/dao-entry'

const daoQuery: string = `
    query DAO($name: String!) {
      dao(id: $name) {
        ...daoFragment
      }
    }
    ${daoFragment}
  `

export default daoQuery
