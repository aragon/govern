import { useState, useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';

import { DISPUTE } from 'queries/court';
import { TRANSFERS } from 'queries/finance';
import { courtClient } from 'index';
import { PROPOSAL_DETAILS, PROPOSAL_LIST } from 'queries/proposals';
import { DAO_BY_NAME, DAO_LIST, GOVERN_REGISTRY } from 'queries/dao';

import {
  transformProposalDetails,
  transformProposals,
  transformDaoDetails,
  transformFinance,
} from 'utils/transforms';

const POLL_INTERVAL = 5000;

export function useDaoQuery(daoName: string) {
  const { data, loading, error, refetch } = useQuery(DAO_BY_NAME, {
    variables: { name: daoName },
  });

  const daoData = useMemo(() => {
    if (data) {
      return transformDaoDetails(data);
    }
    return null;
  }, [data]);

  return {
    data: daoData,
    loading: loading,
    error,
    refetch,
  };
}

export function useDaosQuery() {
  const { data, fetchMore, loading, error } = useQuery(DAO_LIST, {
    variables: {
      offset: 0,
      limit: 12,
    },
  });

  return { data, loading, error, fetchMore };
}

export function useFinanceQuery(executorId: string) {
  const { data, loading, error } = useQuery(TRANSFERS, {
    variables: { id: executorId },
  });

  const transfers = useMemo(() => {
    if (data) {
      return transformFinance(data);
    }
  }, [data]);
  return { data: transfers, loading, error };
}

export function useGovernRegistryQuery() {
  const { data, loading, error } = useQuery(GOVERN_REGISTRY);

  return {
    data,
    loading,
    error,
  };
}

export function useLazyProposalQuery() {
  const [proposalData, setProposalData] = useState<any>(null);

  const [getProposalData, { loading }] = useLazyQuery(PROPOSAL_DETAILS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    pollInterval: POLL_INTERVAL,
    onCompleted: (newData) => {
      const transformedData = transformProposalDetails(newData);
      setProposalData(transformedData);
    },
  });

  return { getProposalData, loading, data: proposalData };
}

export function useLazyProposalListQuery() {
  // const [proposalList, setProposalList] = useState<any>(null);
  const [getQueueData, { loading, data, error, fetchMore }] = useLazyQuery(PROPOSAL_LIST);

  // onCompleted doesn't work with lazyQuery when clicked on `fetchMore`.
  // https://github.com/apollographql/apollo-client/issues/6636
  const proposalList = useMemo(() => {
    if (data) {
      return transformProposals(data);
    }
  }, [data]);

  return {
    getQueueData,
    fetchMore: fetchMore,
    loading,
    data: proposalList,
    error,
  };
}

export function useProposalListQuery(queueId: string) {
  // const [proposalList, setProposalList] = useState<any>(null);
  const { loading, data, error, refetch } = useQuery(PROPOSAL_LIST, {
    variables: { id: queueId },
  });

  // onCompleted doesn't work with lazyQuery when clicked on `fetchMore`.
  // https://github.com/apollographql/apollo-client/issues/6636
  const proposalList = useMemo(() => {
    console.log(data);
    if (data) {
      return transformProposals(data);
    }
  }, [data]);

  return {
    refetch,
    loading,
    data: proposalList,
    error,
  };
}

export function useLazyDisputeQuery(disputId: number) {
  const [getDispute, { loading, error, data }] = useLazyQuery(DISPUTE, {
    notifyOnNetworkStatusChange: true,
    variables: { id: disputId },
    client: courtClient,
  });

  return {
    getDispute,
    data,
    loading,
    error,
  };
}
