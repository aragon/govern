import { gql } from '@apollo/client';

export const DISPUTE = gql`
  query dispute($id: ID!) {
    disputes(where: { id: $id }) {
      id
      finalRuling
    }
  }
`;
