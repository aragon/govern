import gql from 'graphql-tag'

const GovernDaoBase = gql`
  fragment GovernDaoBase on Govern {
    id
    address
    metadata
    registryEntries {
      id
    }
    containers {
      id
    }
    roles {
      id
    }
  }
`

export const QUERY_DAO = gql`
  query RegistryEntry($name: String!) {
    registryEntries(where: { name: $name }, first: 1) {
      id
      executor {
        ...GovernDaoBase
      }
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
