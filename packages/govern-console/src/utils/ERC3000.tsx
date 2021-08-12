import { toUtf8Bytes } from '@ethersproject/strings';
import { ethers } from 'ethers';
import { DaoConfig, ProposalParams, PayloadType } from '@aragon/govern';

// below types ensure that some of the properties on payload
// ('executionTime' | 'allowFailuresMap' | "proof") are optional
// and other ones stay as required. https://github.com/Microsoft/TypeScript/issues/25760
// and proof property if it exists must be a string

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type optionalPayload = WithOptional<PayloadType, 'executionTime' | 'allowFailuresMap' | 'proof'>;
export interface Payload extends optionalPayload {
  proof: string;
}

// NOTE: configData comes directly from a subgraph, which may contain
// more fields than Govern's DaoConfig can handle.
// so we build it manually.
export const buildConfig = (configData: any): DaoConfig => {
  const config: DaoConfig = {
    executionDelay: configData.executionDelay,
    scheduleDeposit: {
      token: configData.scheduleDeposit.token,
      amount: configData.scheduleDeposit.amount,
    },
    challengeDeposit: {
      token: configData.challengeDeposit.token,
      amount: configData.challengeDeposit.amount,
    },
    maxCalldataSize: configData.maxCalldataSize,
    resolver: configData.resolver,
    rules: configData.rules,
  };
  return config;
};

// NOTE: ProposalInfo comes directly from a subgraph, which may contain
// more fields than Govern's PayloadType and DaoConfig can handle.
// so we build both of them manually.
export const getProposalParams = (proposalInfo: any) => {
  const config = buildConfig(proposalInfo.config);

  const payload: PayloadType = {
    actions: proposalInfo.payload.actions,
    executor: proposalInfo.payload.executor.address,
    proof: proposalInfo.payload.proof,
    submitter: proposalInfo.payload.submitter,
    allowFailuresMap: proposalInfo.payload.allowFailuresMap,
    executionTime: proposalInfo.payload.executionTime,
    nonce: proposalInfo.payload.nonce,
  };

  const params: ProposalParams = {
    payload,
    config,
  };
  return params;
};

export const buildContainer = (payload: Payload, config: DaoConfig): ProposalParams => {
  // buildContainer should be called right before proposal.schedule() to minimize hitting contract asssertion
  // `require(executionTime > executionDelay + block.timestamp)` where executionTime becomes stale and invalid
  const containerPayload: PayloadType = {
    executionTime:
      payload.executionTime ||
      Math.round(Date.now() / 1000) + parseInt(config.executionDelay.toString()) + 150, // add 150 seconds for network latency.
    submitter: payload.submitter,
    executor: payload.executor,
    actions: payload.actions || [],
    allowFailuresMap: payload.allowFailuresMap || ethers.utils.hexZeroPad('0x0', 32),
    proof: payload.proof || toUtf8Bytes('0x'),
  };

  const container: ProposalParams = {
    payload: containerPayload,
    config: config,
  };

  return container;
};
