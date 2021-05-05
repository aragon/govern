/* eslint-disable */
import { ethers } from 'ethers';
import { toUtf8Bytes } from '@ethersproject/strings';

import { DaoConfig, Proposal, ProposalOptions, ProposalParams, PayloadType } from '@aragon/govern';

export const buildPayload = ({
  submitter,
  executor,
  actions,
  executionTime,
  executionDelay,
  proof,
}: any) => {
  const payload: PayloadType = {
    executionTime: executionTime || Math.round(Date.now() / 1000) + parseInt(executionDelay) + 30, // add 30 seconds for network latency.
    submitter,
    executor,
    actions: actions || [],
    allowFailuresMap: ethers.utils.hexZeroPad('0x0', 32),
    proof: toUtf8Bytes(proof),
  };

  return payload;
};


export const getProposalParams = (proposalInfo:any) => {
  const config: DaoConfig = { ...proposalInfo.config }

  const payload: PayloadType = {
    ...proposalInfo.payload,
    executor: proposalInfo.payload.executor.address
  };

  const params: ProposalParams = {
    payload,
    config,
  };
  return params;
}