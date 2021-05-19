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
  // TODO: Giorgi when the buildContainer is called, we already set `executionTime` as stated below.
  // The important part is how many seconds we add as the last step. currently it's 150.
  // This is important because in the contract we have `require(executionTime > executionDelay + block.timestamp)
  // After the buildContainer is called, we don't immediatelly call transactions because we show modal which
  // contains all the necessary transactions. The idea is that if we have 0 instead of 150, before we
  // start executing this transaction(maybe user didn't click get started or first transaction took time)
  // when this tx gets to the contract, executionTime > executionDelay + block.timestamp will be invalid.
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

export const getProposalParams = (proposalInfo: any) => {
  const config: DaoConfig = { ...proposalInfo.config };

  const payload: PayloadType = {
    ...proposalInfo.payload,
    executor: proposalInfo.payload.executor.address,
    // subgraph returns timestamps for dates in secs, which
    // we transform into Ms. Before sending dates back, we
    // need to convert them into seconds again.
    executionTime: proposalInfo.payload.executionTime / 1000,
  };

  const params: ProposalParams = {
    payload,
    config,
  };
  return params;
};
