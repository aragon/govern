import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticQueue, { OptimisticQueue } from './optimisticQueue'

export interface OptimisticGame {
  id: string
  name: string
  queue: OptimisticQueue
  metadata: string
}

const optimisticGame: DocumentNode = gql`
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

export default optimisticGame
