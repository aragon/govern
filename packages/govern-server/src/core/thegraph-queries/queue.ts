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
  query RegistryEntry($name: String!) {
    registryEntries(where: { name: $name }, first: 1) {
      queue {
        ...QueueBase
      }
    }
  }
  ${QueueBase}
`
