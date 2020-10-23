import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticQueue from '../fragments/optimisticQueue'

const queue: DocumentNode = gql`
    query Queue($id: ID) {
      OptimisticQueue(id: $id) {
        ...OptimisticQueue_optimisticQueue
      }
    }
    ${optimisticQueue}
  `

export default queue
