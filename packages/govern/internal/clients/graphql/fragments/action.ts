import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Address } from '../../lib/types/Address'

export interface Action {
  id: string
  to: Address
  value: string
  data: string
}

const action: DocumentNode = gql`
    fragment Action_action on Action {
      id
      to
      value
      data
    }
  `

export default action
