import { gql } from '@apollo/client';

export const TRANSFERS = gql`
  query DAO($name: String) {
    daos(where: { name: $name }) {
      id
      executor {
        deposits {
          id
          amount
          sender
          token
          reference
        }
        withdraws {
          id
          amount
          to
          from
          token
        }
      }
    }
  }
`;
