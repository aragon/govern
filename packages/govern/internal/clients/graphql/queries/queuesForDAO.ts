import gql from 'graphql-tag'
import optimisticQueue from '../fragments/optimisticQueue'

export default gql`
    query QueuesForDao($address: String) {
      dao(address: $address) {
        id
        queues() {
          ...OptimisticQueue_optimisticQueue
        }
      }
    }
    ${optimisticQueue}
  `