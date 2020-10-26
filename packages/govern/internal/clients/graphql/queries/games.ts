import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticGame  from '../fragments/optimisticGame'

const games: DocumentNode = gql`
    query Games($address: String) {
      dao(address: $address) {
        games() {
          ...OptimisticGame_optimisticGame
        }  
      }
    }
    ${optimisticGame}
  `

export default games
