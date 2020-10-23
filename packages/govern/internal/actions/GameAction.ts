import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'

export default class GameAction extends AbstractAction {
  protected gqlQuery: DocumentNode = gql`
    query Game($name: String) {
      game(name: $name) {
        id
          name
          queue {
            id
            address
            config
            queue {
              id
              status 
              nonce
              executionTime
              submitter
              actions {
                id
                to
                value
                data
              }
              proof
              collateral {
                id
                token
                amount
              }
              createdAt
            }
          }
          metadata
      }
    }
  `
}
