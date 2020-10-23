import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

const collateral: DocumentNode = gql`
    fragment Collateral_collateral on Collateral {
      id
      token
      amount
    }
  `

export default collateral
