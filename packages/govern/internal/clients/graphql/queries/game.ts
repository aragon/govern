import optimisticGame from '../fragments/optimisticGame'

const game: string = `
    query Game($name: String) {
      game(name: $name) {
        ...OptimisticGame_optimisticGame
      }
    }
    ${optimisticGame}
  `

export default game
