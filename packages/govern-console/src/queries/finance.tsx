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
        typename: __typename
      }
      withdraws {
        id
        amount
        to
        from
        token
        reference
        typename: __typename
      }
    }
  }
`;
