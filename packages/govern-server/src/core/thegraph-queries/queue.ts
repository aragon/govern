import gql from 'graphql-tag'

const QueueBase = gql`
  fragment QueueBase on GovernQueue {
    id
    address
    config {
      id
    }
    registryEntries {
      id
    }
    queued {
      id
      state
      config {
        id
      }
    }
    roles {
      id
    }
  }
`

export const QUERY_QUEUE = gql`
  query GovernQueue($queue: String!) {
    governQueue(id: $queue) {
      ...QueueBase
    }
  }
  ${QueueBase}
`

export const QUERY_QUEUES = gql`
  query GovernQueue {
    governQueues {
      ...QueueBase
    }
  }
  ${QueueBase}
`

export const QUERY_QUEUES_BY_DAO = gql`
  query Govern($address: String!) {
    govern(id: $address) {
      registryEntries {
        queue {
          ...QueueBase
        }
      }
    }
  }
  ${QueueBase}
`
