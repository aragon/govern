/* eslint-disable */
import { gql } from '@apollo/client';

export const GET_PROPOSAL_LIST = gql`
  query proposals($id: ID, $offset: Int, $limit: Int) {
    governQueue(id: $id) {
      id
      containers(
        skip: $offset, 
        first: $limit, 
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
