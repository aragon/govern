import gql from 'graphql-tag'
import * as fragments from './fragments'

export const DAO = gql`
  query Govern($address: String!) {
    govern(id: $address) {
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
  query GovernQueue($queue: String!) {
    governQueue(id: $queue) {
      ...Queue_queue
    }
  }
  ${fragments.QUEUE_FRAGMENT}
`

export const QUEUES = gql`
  query GovernQueue {
    governQueues {
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
  query Govern($address: String!) {
    govern(id: $address) {
      games {
        queue {
          ...Queue_queue
        }
      }
    }
  }
  ${fragments.QUEUE_FRAGMENT}
`
