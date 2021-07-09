import { useEffect } from 'react';
import { useLazyDisputeQuery } from 'hooks/query-hooks';

import { networkEnvironment } from 'environment';
const { defaultDaoConfig } = networkEnvironment;

export function useDisputeHook(disputeId: number, resolver: string) {
  const { getDispute, loading, data, error } = useLazyDisputeQuery(disputeId);
  // TODO:
  // if the proposal doesn't use aragon's court, there're 2 choices
  // how we can get dispute information
  // 1. aragon's subgraph or 2. fetching it from court's contract directly.
  // Since custom resolver that proposal might be using
  // mighn't have `getDispute` and `getDisputeManager`, for simplicity, let's use aragon's
  // court subgraph.
  const isDefaultCourt = defaultDaoConfig.resolver.toLowerCase() === resolver.toLowerCase();

  useEffect(() => {
    if (isDefaultCourt) {
      getDispute();
    }
  }, [getDispute, isDefaultCourt]);

  return {
    error,
    loading,
    data,
    isDefaultCourt,
  };
}
