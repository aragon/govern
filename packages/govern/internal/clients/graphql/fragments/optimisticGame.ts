import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticQueue from './optimisticQueue'

const optimisticGame: DocumentNode = gql`
    fragment OptimisticGame_optimisticGame on OptimisticGame {
      id
      name
      metadata
    }
    ${optimisticQueue}
  `

export default optimisticGame
