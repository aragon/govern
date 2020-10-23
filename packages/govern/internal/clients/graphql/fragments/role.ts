import gql from 'graphql-tag'

export default gql`
    fragment Role_role on Role {
      id
      entity
      selector
      who
      granted
      frozen
    }
  `
