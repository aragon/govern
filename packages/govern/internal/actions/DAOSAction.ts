import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'

export default class DAOSAction extends AbstractAction {
  protected gqlQuery: DocumentNode = gql`
    query DAOS {
      daos {
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
          enitity
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
