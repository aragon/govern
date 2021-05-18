import { gql } from '@apollo/client';

export const GET_DAO_LIST = gql`
  query DAOs($offset: Int, $limit: Int) {
    daos(skip: $offset, first: $limit, orderBy: createdAt, orderDirection: desc) {
      id
      name
      createdAt
      queue {
        id
        address
        nonce
        config {
          executionDelay
          scheduleDeposit {
            token
            amount
          }
          challengeDeposit {
            token
            amount
          }
          resolver
          rules
          maxCalldataSize
        }
      }
      executor {
        id
        address
      }
      token
      registrant
    }
  }
`;

export const GET_DAO_BY_NAME = gql`
  query DAO($name: string) {
    dao(name: $name) {
      id
      name
      queue {
        id
        address
        nonce
        config {
          executionDelay
          scheduleDeposit {
            token
            amount
          }
          challengeDeposit {
            token
            amount
          }
          resolver
          rules
          maxCalldataSize
        }
      }
      executor {
        id
        address
      }
      token
      registrant
    }
  }
`;

export const GET_GOVERN_REGISTRY_DATA = gql`
  {
    governRegistries(limit: 1) {
      id
      count
    }
  }
`;
