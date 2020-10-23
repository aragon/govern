import gql from 'graphql-tag'
import optimisticGame from '../fragments/optimisticGame'

export default gql`
    query Games($address: String) {
      dao(address: $address) {
        id
        games() {
          ...OptimisticGame_optimisticGame
        }  
      }
    }
    ${optimisticGame}
  `