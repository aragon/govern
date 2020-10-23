import gql from 'graphql-tag'

export default gql`
    fragment Collateral_collateral on Collateral {
      id
      token
      amount
    }
  `
