import { gql } from '@apollo/client';

export const PROPOSAL_LIST = gql`
  query proposals($id: ID, $offset: Int, $limit: Int) {
    governQueue(id: $id) {
      id
      address
      nonce
      containers(skip: $offset, first: $limit, orderBy: createdAt, orderDirection: desc) {
        id
        state
        createdAt
        payload {
          executionTime
        }
      }
      nonce
    }
  }
`;

export const PROPOSAL_DETAILS = gql`
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
