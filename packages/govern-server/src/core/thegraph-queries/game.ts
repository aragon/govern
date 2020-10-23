import gql from 'graphql-tag'

const GameBase = gql`
  fragment GameBase on OptimisticGame {
    id
    name
    queue {
      id
    }
    executor {
      id
    }
  }
`

export const QUERY_GAME = gql`
  query OptimisticGame($name: String!) {
    optimisticGame(id: $name) {
      ...GameBase
    }
  }
  ${GameBase}
`

export const QUERY_GAMES = gql`
  query OptimisticGame {
    optimisticGames {
      ...GameBase
    }
  }
  ${GameBase}
`
