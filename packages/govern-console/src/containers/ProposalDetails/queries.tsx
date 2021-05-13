import { gql } from '@apollo/client';

export const GET_PROPOSAL_DETAILS_QUERY = gql`
  query proposalDetails($id: ID) {
    container(id: $id) {
      id
      state
      createdAt
      queue {
        roles {
          selector
          who
          granted
          frozen
        }
      }
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
        executor {
          address
        }
        actions {
          to
          value
          data
        }
        allowFailuresMap
        proof
      }
      history {
        id
        createdAt
        ... on ContainerEventChallenge {
          disputeId
          challenger
          collateral {
            token
            amount
          }
          disputeId
          reason
          resolver
        }
        ... on ContainerEventSchedule {
          collateral {
            token
            amount
          }
        }
        ... on ContainerEventExecute {
          execResults
        }
        ... on ContainerEventResolve {
          approved
        }
        ... on ContainerEventVeto {
          reason
        }
      }
    }
  }
`;
