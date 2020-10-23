import gql from 'graphql-tag'
import collateral from './collateral'
import action from './action'

export default gql`
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
