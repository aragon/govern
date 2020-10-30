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

const GovernDaoComplete = gql`
  fragment GovernDaoComplete on Govern {
    id
    address
    metadata
    registryEntries {
      id
      name
      queue {
        id
        address
        config {
          executionDelay
          scheduleDeposit {
            id
            token
            amount
          }
          challengeDeposit {
            id
            token
            amount
          }
          resolver
          rules
        }
        queued {
          id
          state
          payload {
            id
            nonce
            executionTime
            submitter
            actions {
              id
              to
              value
              data
            }
            allowFailuresMap
            proof
          }
          history {
            id
            createdAt
          }
        }
      }
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
  query Govern($address: String!) {
    govern(id: $address) {
      ...GovernDaoComplete
    }
  }
  ${GovernDaoComplete}
`

export const QUERY_DAOS = gql`
  query Govern {
    governs {
      ...GovernDaoComplete
    }
  }
  ${GovernDaoComplete}
`
