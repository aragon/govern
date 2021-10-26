import { useWallet } from 'providers/AugmentedWallet';
import { useMemo } from 'react';
import QueueApprovals from 'services/QueueApprovals';
import FacadeProposal from 'services/Proposal';

import { Proposal, ProposalOptions } from '@aragon/govern';

export function useFacadeProposal(queue: string, resolver: string) {
  const context: any = useWallet();
  const { account, provider } = context;

  // TODO: GIORGI
  // The react use memo below gets called 4 times. The reason for this is
  // `account` dependency changes 4 times after clicking connect button on the UI.
  // this should be called 1 time only.
  const proposalInstance = useMemo(() => {
    if (provider && account && queue && resolver) {
      const queueApprovals = new QueueApprovals(account, queue, resolver);
      const proposal = new Proposal(queue, {} as ProposalOptions);
      return new FacadeProposal(queueApprovals, proposal) as FacadeProposal & Proposal;
    }
  }, [provider, account, queue, resolver]);

  return proposalInstance;
}
