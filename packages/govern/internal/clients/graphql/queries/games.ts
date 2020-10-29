import optimisticGame  from '../fragments/optimisticGame'

const games: string = `
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
