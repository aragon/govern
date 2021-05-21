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
          id
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
        id
        roles {
          id
          selector
          who
          granted
          frozen
        }
      }
      config {
        id
        executionDelay
        scheduleDeposit {
          id
          token
          amount
        }
        challengeDeposit {
          id
          token
          amount
        }
        resolver
        rules
        maxCalldataSize
      }
      payload {
        id
        nonce
        executionTime
        submitter
        executor {
          id
          address
        }
        actions {
          id
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
          id
          disputeId
          challenger
          collateral {
            id
            token
            amount
          }
          disputeId
          reason
          resolver
        }
        ... on ContainerEventSchedule {
          id
          collateral {
            id
            token
            amount
          }
        }
        ... on ContainerEventExecute {
          id
          execResults
        }
        ... on ContainerEventResolve {
          id
          approved
        }
        ... on ContainerEventVeto {
          id
          reason
        }
      }
    }
  }
`;
