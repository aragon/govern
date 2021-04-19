import { gql } from '@apollo/client';

export const GET_PROPOSAL_LIST_QUERY = gql`
  query proposalDetails($id: ID) {
    container(id: $id) {
      id
      state
      config {
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
        maxCalldataSize
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
