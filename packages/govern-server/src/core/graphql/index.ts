import gql from 'graphql-tag'
import * as fragments from './fragments'

export const DAO = gql`
  query Govern($dao: String!) {
    govern(id: $dao) {
      ...Govern_govern
    }
  }
  ${fragments.GOVERN_FRAGMENT}
`

export const DAOS = gql`
  query Govern {
    governs {
      ...Govern_govern
    }
  }
  ${fragments.GOVERN_FRAGMENT}
`

export const QUEUE = gql`
  query OptimisticQueue($queue: String!) {
    optimisticQueue(id: $queue) {
      ...Queue_queue
    }
  }
  ${fragments.QUEUE_FRAGMENT}
`

export const QUEUES = gql`
  query OptimisticQueue {
    optimisticQueues {
      ...Queue_queue
    }
  }
  ${fragments.QUEUE_FRAGMENT}
`

export const GAME = gql`
  query OptimisticGame($name: String!) {
    optimisticGame(id: $name) {
      ...Game_game
    }
  }
  ${fragments.GAME_FRAGMENT}
`

export const GAMES = gql`
  query OptimisticGame {
    optimisticGames {
      ...Game_game
    }
  }
  ${fragments.GAME_FRAGMENT}
`

export const QUEUES_BY_DAO = gql`
  query OptimisticGame($dao: String!) {
    optimisticGames {
      executor(where: { id: $dao }, orderBy: startDate, orderDirection: asc) {
        id
      }
      queue {
        ...Queue_queue
      }
    }
  }
  ${fragments.QUEUE_FRAGMENT}
`
