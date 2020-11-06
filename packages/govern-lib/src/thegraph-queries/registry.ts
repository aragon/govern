import gql from 'graphql-tag'

const RegistryEntryComplete = gql`
  fragment RegistryEntryComplete on RegistryEntry {
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
    executor {
      id
      address
    }
  }
`

export const QUERY_REGISTRY_ENTRY = gql`
  query RegistryEntry($name: String!) {
    registryEntry(id: $name) {
      ...RegistryEntryComplete
    }
  }
  ${RegistryEntryComplete}
`

export const QUERY_REGISTRY_ENTRIES = gql`
  query RegistryEntry {
    registryEntries {
      ...RegistryEntryComplete
    }
  }
  ${RegistryEntryComplete}
`
