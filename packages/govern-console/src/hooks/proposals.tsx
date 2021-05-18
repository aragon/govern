import { useWallet } from 'AugmentedWallet';
import React, { useState, memo, useRef, useEffect } from 'react';
import QueueApprovals from 'services/QueueApprovals';
import FacadeProposal from 'services/Proposal';

import { Proposal, ProposalOptions, PayloadType, ActionType } from '@aragon/govern';

export function useFacadeProposal(queue: string, resolver: string) {
  const context: any = useWallet();
  const { account, isConnected, provider } = context;

  // TODO: GIORGI
  // The react use memo below gets called 4 times. The reason for this is
  // `account` dependency changes 4 times after clicking connect button on the UI.
  // this should be called 1 time only.
  const proposalInstance = React.useMemo(() => {
    if (provider && account && queue && resolver) {
      const queueApprovals = new QueueApprovals(account, queue, resolver);
      const proposal = new Proposal(queue, {} as ProposalOptions);
      return new FacadeProposal(queueApprovals, proposal) as FacadeProposal & Proposal;
    }
  }, [provider, account, queue, resolver]);

  return proposalInstance;
}
