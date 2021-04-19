import { gql } from '@apollo/client';

export const GET_DAO_BY_NAME = gql`
  query DAO($name: string) {
    dao(name: $name) {
      id
      name
      queue {
        id
        address
        nonce
        config
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
