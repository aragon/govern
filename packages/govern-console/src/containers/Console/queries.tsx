import { gql } from '@apollo/client';

export const GET_DAO_LIST = gql`
  query DAOs($offset: Int, $limit: Int) {
    daos(skip: $offset, first: $limit) {
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
export const GET_GOVERN_REGISTRY_DATA = gql`
  {
    governRegistries(limit: 1) {
      id
      count
    }
  }
`;
