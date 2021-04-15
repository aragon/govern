import { gql } from '@apollo/client';

export const GET_PROPOSAL_LIST = gql`
  query proposals($id: ID) {
    governQueue(id: $id) {
      id
      containers {
        id
        state
        history {
          id
          createdAt
        }
      }
    }
  }
`;
