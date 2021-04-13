import { gql } from '@apollo/client';

export const GET_DAO_LIST = gql`
  query DAOs($offset: Int, $limit: Int) {
    daos(offset: $offset, limit: $limit) {
      id
      name
      queue {
        id
        nonce
      }
      executor {
        id
        balance
      }
      token
      registrant
    }
  }
`;
