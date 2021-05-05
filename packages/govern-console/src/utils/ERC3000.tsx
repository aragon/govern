/* eslint-disable */
import { toUtf8Bytes } from '@ethersproject/strings';
import { ethers } from 'ethers';
import { DaoConfig, ProposalParams, PayloadType } from '@aragon/govern';

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


// export const setConfigForm = ({
//   setValue,
//   config
// }: { setValue: Function,  config: DaoConfig}) => {
  
//   setValue('daoConfig.executionDelay', config.executionDelay)
//   setValue('daoConfig.resolver', config.resolver)
//   setValue('daoConfig.rules', config.rules)
//   setValue('daoConfig.scheduleDeposit.token', config.scheduleDeposit.token)
//   setValue('daoConfig.challengeDeposit.token', config.challengeDeposit.token)
//   setValue('daoConfig.maxCalldataSize', config.maxCalldataSize)

//   // setValue('daoConfig.scheduleDeposit.amount', await correctDecimal(
//   //   config.scheduleDeposit.token,
//   //   config.scheduleDeposit.amount,
//   //   false,
//   // ))
//   // setValue('daoConfig.challengeDeposit.amount', await correctDecimal(
//   //   config.challengeDeposit.token,
//   //   config.challengeDeposit.amount,
//   //   false,
//   // ))
// }