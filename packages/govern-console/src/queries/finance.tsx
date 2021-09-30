import { gql } from '@apollo/client';

export const TRANSFERS = gql`
  query finances($id: ID!) {
    govern(id: $id) {
      id
      deposits {
        id
        amount
        sender
        token
        reference
        createdAt
      }
      withdraws {
        id
        amount
        to
        from
        token
        createdAt
      }
    }
  }
`;
