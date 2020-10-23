import gql from 'graphql-tag'
import optimisticQueue from './optimisticQueue'

export default gql`
    fragment OptimisticGame_optimisticGame on OptimisticGame {
      id
      name
      queue {
        ...OptimisticQueue_optimisticQueue
      }
      metadata
    }
    ${optimisticQueue}
  `
