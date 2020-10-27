import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import collateral, { Collateral } from './collateral'
import action, { Action } from './action'
import { Address } from '../../lib/types/Address'

export interface Item {
  id: string
  status: string
  nonce: string
  executionTime: string
  submitter: Address
  actions: Action[]
  proof: string
  collateral: Collateral
  createdAt: string
}

const item: DocumentNode = gql`
    fragment Item_item on Item {
      id
      status
      nonce
      executionTime
      submitter
      actions {
        ...Action_action
      }
      proof
      collateral {
       ...Collateral_collateral
      }
      createdAt
    }
    ${action}
    ${collateral}
  `

export default item
