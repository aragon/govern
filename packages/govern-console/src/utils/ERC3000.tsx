/* eslint-disable */
import { CustomTransaction, Response } from 'utils/types';
import { ethers, BigNumber } from 'ethers';
import { erc20TokenABI } from './abis/erc20';
import {
  Proposal,
  ProposalOptions,
  PayloadType,
  ActionType,
} from '@aragon/govern';

type payloadArgs = {
  submitter: string;
  executor: string;
  executionTime?: number;
  actions?: ActionType[];
  executionDelay: string;
  proof: any; // TODO: change it to bytes type
};

export const buildPayload = ({
  submitter,
  executor,
  actions,
  executionTime,
  executionDelay,
  proof,
}: payloadArgs): any => {
  const payload: PayloadType = {
    executionTime:
      executionTime ||
      Math.round(Date.now() / 1000) + parseInt(executionDelay) + 30, // add 30 seconds for network latency.
    submitter,
    executor,
    actions: actions || [],
    allowFailuresMap: ethers.utils.hexZeroPad('0x0', 32),
    proof: proof,
  };

  return payload;
};
