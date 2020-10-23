import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'

export default class GamesAction extends AbstractAction {
  protected gqlQuery: DocumentNode = gql`
    query Games($address: String) {
      dao(address: $address) {
        id
        games() {
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
    }
  `
}
