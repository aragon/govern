import gql from 'graphql-tag'
import collateral from './collateral'
import item from './item'

export default gql`
    fragment Challenge_challenge on Challenge {
      id
      challenger
      item {
        ...Item_item
      }
      arbitrator
      disputeId
      evidences {
        id
        data
        submitter
        createdAt
      }
      collateral {
        ...Collateral_collateral
      }
      ruling: String
      approved: Boolean
      createdAt: String!
    }
    ${collateral}
    ${item}
  `
