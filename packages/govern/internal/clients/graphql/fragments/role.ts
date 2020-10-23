import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

const role: DocumentNode = gql`
    fragment Role_role on Role {
      id
      entity
      selector
      who
      granted
      frozen
    }
  `

export default role
