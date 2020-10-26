import gql from 'graphql-tag'

const GovernDaoBase = gql`
  fragment GovernDaoBase on Govern {
    id
    address
    metadata
    games {
      id
    }
    executions {
      id
    }
    roles {
      id
    }
  }
`

export const QUERY_DAO = gql`
  query Govern($address: String!) {
    govern(id: $address) {
      ...GovernDaoBase
    }
  }
  ${GovernDaoBase}
`

export const QUERY_DAOS = gql`
  query Govern {
    governs {
      ...GovernDaoBase
    }
  }
  ${GovernDaoBase}
`
