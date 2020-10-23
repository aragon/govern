import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import collateral from './collateral'
import action from './action'

const item: DocumentNode = gql`
    fragment Item_item on Item {
      id
      status
      nonce
      executionTime
      submitter
      actions {
        ..Action_action
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
