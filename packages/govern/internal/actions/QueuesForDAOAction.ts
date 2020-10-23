import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'

export default class QueuesForDAOAction extends AbstractAction {
  protected gqlQuery: DocumentNode = gql`
    query QueuesForDao($address: String) {
      dao(address: $address) {
        id
        queues() {
          id
          address
          config
          games {}
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
          executions {
            id
            sender
            actions {
              id
              to
              value
              data
              item {
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
            results
          }
          challenges {
            id
            challenger
            item {
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
            arbitrator
            disputeId
            evidences {
              id
              data
              submitter
              createdAt
            }
            collateral {
              id
              token 
              amount
            }
            ruling
            approved
            createdAt
          }
          vetos {
            id
            item {
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
            reason
            submitter
            collateral: {
              id
              token 
              amount
            }
            createdAt
          }
          roles {
            id
            entitiy
            selector
            who
            granted
            frozen
          }
        }  
      }
    }
  `
}
