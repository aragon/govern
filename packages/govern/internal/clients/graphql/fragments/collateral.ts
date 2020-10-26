import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export interface Collateral {
  id: string
  token: string
  amount: string
}

const collateral: DocumentNode = gql`
    fragment Collateral_collateral on Collateral {
      id
      token
      amount
    }
  `

export default collateral
