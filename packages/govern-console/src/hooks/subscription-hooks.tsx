import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { DAO_BY_NAME, DAO_LIST, GOVERN_REGISTRY } from 'queries/dao';
import { PROPOSAL_DETAILS, PROPOSAL_LIST } from 'queries/proposals';
import { transformProposalDetails, transformProposals } from 'utils/proposal';

export function useDaoSubscription(daoName: string) {
  const { data, loading, error } = useQuery(DAO_BY_NAME, {
    variables: { name: daoName },
  });

  return {
    data,
    loading,
    error,
  };
}

export function useDaosSubscription() {
  const { data, fetchMore, loading, error } = useQuery(DAO_LIST, {
    variables: {
      offset: 0,
      limit: 12,
    },
  });

  return { data, loading, error, fetchMore };
}

export function useGovernRegistrySubscription() {
  const { data, loading, error } = useQuery(GOVERN_REGISTRY);

  return {
    data,
    loading,
    error,
  };
}

export function useLazyProposalDetails() {
  const [getProposalData, { loading, data }] = useLazyQuery(PROPOSAL_DETAILS);

  const proposalData = React.useMemo(() => {
    if (!data) {
      return null;
    }
    return transformProposalDetails(data);
  }, [data]);

  return { getProposalData, loading, data: proposalData };
}

export function useLazyProposalList() {
  const [getQueueData, { loading, data, error, fetchMore }] = useLazyQuery(PROPOSAL_LIST, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  // TODO: Giorgi This needs to be replaced
  // by this idea https://github.com/apollographql/apollo-client/discussions/8264
  const loadMore = React.useCallback(
    async (offset: number) => {
      if (!fetchMore) {
        return {
          data: null,
        };
      }

      const { data } = await fetchMore({
        variables: {
          offset: offset,
        },
      });

      return {
        data: transformProposals(data),
      };
    },
    [fetchMore],
  );

  const proposalList = React.useMemo(() => {
    if (!data) {
      return null;
    }
    return transformProposals(data);
  }, [data]);

  return {
    getQueueData,
    fetchMore: loadMore,
    loading,
    data: proposalList,
    error,
  };
}