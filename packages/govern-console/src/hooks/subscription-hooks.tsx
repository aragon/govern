import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { DAO_BY_NAME, DAO_LIST, GOVERN_REGISTRY } from 'queries/dao';
import { PROPOSAL_DETAILS, PROPOSAL_LIST } from 'queries/proposals';
import { transformProposalDetails, transformProposals } from 'utils/proposal';

export function useDaoSubscription(daoName: string) {
  console.log(daoName, ' name here');
  const { data, loading, error } = useQuery(DAO_BY_NAME, {
    variables: { name: daoName },
  });

  console.log(data, ' data here');

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
  const [getQueueData, { loading, data, error, fetchMore }] = useLazyQuery(PROPOSAL_LIST);

  const proposalList = React.useMemo(() => {
    if (!data) {
      return null;
    }
    return transformProposals(data);
  }, [data]);

  return {
    getQueueData,
    fetchMore: fetchMore,
    loading,
    data: proposalList,
    error,
  };
}
