import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Address } from '../../lib/types/Address'

export interface Role {
  id: string
  entitiy: Address
  selector: string
  who: Address
  granted: boolean
  frozen: boolean
}

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
