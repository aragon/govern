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
        typename: __typename
      }
      withdraws {
        id
        amount
        to
        from
        token
        reference
        createdAt
        typename: __typename
      }
    }
  }
`;
