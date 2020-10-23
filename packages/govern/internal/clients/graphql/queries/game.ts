import gql from 'graphql-tag'
import optimisticGame from '../fragments/optimisticGame'

export default gql`
    query Game($name: String) {
      game(name: $name) {
        ...OptimisticGame_optimisticGame
      }
    }
    ${optimisticGame}
  `