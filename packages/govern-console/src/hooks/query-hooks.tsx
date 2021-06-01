import { useState, useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { DAO_BY_NAME, DAO_LIST, GOVERN_REGISTRY } from 'queries/dao';
import { PROPOSAL_DETAILS, PROPOSAL_LIST } from 'queries/proposals';
import {
  transformProposalDetails,
  transformProposals,
  transformDaoDetails,
} from 'utils/transforms';

import { useWallet } from 'AugmentedWallet';

export function useDaoQuery(daoName: string) {
  const context: any = useWallet();
  const { provider } = context;

  const [daoData, setDaoData] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const { data, loading, error } = useQuery(DAO_BY_NAME, {
    variables: { name: daoName },
    onCompleted: async () => {
      const daoData = await transformDaoDetails(data, provider);
      setDaoData(daoData);
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  return {
    data: daoData,
    loading: isLoading,
    error,
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

export function useGovernRegistryQuery() {
  const { data, loading, error } = useQuery(GOVERN_REGISTRY);

  return {
    data,
    loading,
    error,
  };
}

export function useLazyProposalQuery() {
  const context: any = useWallet();
  const { provider } = context;

  const [proposalData, setProposalData] = useState<any>(null);

  const [getProposalData, { loading, data }] = useLazyQuery(PROPOSAL_DETAILS, {
    onCompleted: async () => {
      const finalD = await transformProposalDetails(data, provider);
      setProposalData(finalD);
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
