import { gql } from '@apollo/client';

export const DAO_BY_NAME = gql`
  query DAO($name: String) {
    daos(where: { name: $name }) {
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
            decimals
            symbol
            name
          }
          challengeDeposit {
            token
            amount
            decimals
            symbol
            name
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
      minter
    }
  }
`;

export const DAO_LIST = gql`
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
            decimals
            symbol
            name
          }
          challengeDeposit {
            token
            amount
            decimals
            symbol
            name
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

export const GOVERN_REGISTRY = gql`
  {
    governRegistries(limit: 1) {
      id
      count
    }
  }
`;
