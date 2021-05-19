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
interface payload extends optionalPayload {
  proof: string;
}

export const buildContainer = (payload: payload, config: DaoConfig): ProposalParams => {
  // executionTime:
  // payload.executionTime ||
  // Math.round(Date.now() / 1000) + parseInt(config.executionDelay.toString()) + 30

  const containerPayload: PayloadType = {
    executionTime: Math.round(Date.now() / 1000) + 120, // add 30 seconds for network latency.
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

export const getProposalParams = (proposalInfo: any) => {
  const config: DaoConfig = { ...proposalInfo.config };

  const payload: PayloadType = {
    ...proposalInfo.payload,
    executor: proposalInfo.payload.executor.address,
  };

  const params: ProposalParams = {
    payload,
    config,
  };
  return params;
};
