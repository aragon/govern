import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'

export default class DAOAction extends AbstractAction {
  protected gqlQuery: DocumentNode = gql`
    query DAO($address: String) {
      dao(address: $address) {
        id
        address
        executions {
          id 
          sender
          actions {
            id
            to
            value
            data
          }
          results
        }
        roles {
          id
          entity
          selector
          who
          granted
          frozen
        }
        queues {
          id 
          address
        }
      }
    }
  `
}
