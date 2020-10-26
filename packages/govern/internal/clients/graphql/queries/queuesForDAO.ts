import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticQueue  from '../fragments/optimisticQueue'

const queuesForDao: DocumentNode = gql`
    query QueuesForDao($address: String) {
      dao(address: $address) {
        queues() {
          ...OptimisticQueue_optimisticQueue
        }
      }
    }
    ${optimisticQueue}
  `

export default queuesForDao
