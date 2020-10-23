import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticGame from '../fragments/optimisticGame'

const game: DocumentNode = gql`
    query Game($name: String) {
      game(name: $name) {
        ...OptimisticGame_optimisticGame
      }
    }
    ${optimisticGame}
  `

export default game
