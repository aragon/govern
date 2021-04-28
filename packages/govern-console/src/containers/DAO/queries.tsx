/* eslint-disable */
import { gql } from '@apollo/client';

export const GET_PROPOSAL_LIST = gql`
  query proposals($id: ID, $offset: Int, $limit: Int) {
    governQueue(id: $id) {
      id
      containers(
        skip: $offset
        first: $limit
        orderBy: createdAt
        orderDirection: desc
      ) {
        id
        state
        createdAt
      }
      nonce
    }
  }
`;

export const GET_DAO_BY_NAME = gql`
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
        balance
      }
      token
      registrant
    }
  }
`;
