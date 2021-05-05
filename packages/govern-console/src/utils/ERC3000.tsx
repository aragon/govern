/* eslint-disable */
import { CustomTransaction, Response } from 'utils/types';
import { ethers, BigNumber } from 'ethers';
import { erc20TokenABI } from './abis/erc20';
import { createDao, CreateDaoParams, DaoConfig } from '@aragon/govern';

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


export const setConfigForm = ({
  setValue,
  config
}: { setValue: Function,  config: DaoConfig}) => {
  
  setValue('daoConfig.executionDelay', config.executionDelay)
  setValue('daoConfig.resolver', config.resolver)
  setValue('daoConfig.rules', config.rules)
  setValue('daoConfig.scheduleDeposit.token', config.scheduleDeposit.token)
  setValue('daoConfig.challengeDeposit.token', config.challengeDeposit.token)
  setValue('daoConfig.maxCalldataSize', config.maxCalldataSize)

  // setValue('daoConfig.scheduleDeposit.amount', await correctDecimal(
  //   config.scheduleDeposit.token,
  //   config.scheduleDeposit.amount,
  //   false,
  // ))
  // setValue('daoConfig.challengeDeposit.amount', await correctDecimal(
  //   config.challengeDeposit.token,
  //   config.challengeDeposit.amount,
  //   false,
  // ))
}