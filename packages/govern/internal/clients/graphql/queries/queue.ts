import gql from 'graphql-tag'
import optimisticQueue from '../fragments/optimisticQueue'

export default gql`
    query Queue($id: ID) {
      OptimisticQueue(id: $id) {
        ...OptimisticQueue_optimisticQueue
      }
    }
    ${optimisticQueue}
  `