import { gql } from '@apollo/client';

export const GET_PROPOSAL_LIST_QUERY = gql`
  query proposalDetails($id: ID) {
    container(id: $id) {
      id
      state
      config {
        id
        executionDelay
        scheduleDeposit {
          token
          amount
        }
        challengeDeposit {
          token
          amount
        }
        resolver
        rules
      }
      payload {
        nonce
        executionTime
        submitter
        executor
        actions {
          to
          value
          data
        }
        allowFailuresMap
        proof
      }
    }
  }
`;
