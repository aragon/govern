import { ethers } from 'ethers';
import { DaoConfig } from '@aragon/govern';

export const goodConfig: DaoConfig = {
  executionDelay: 1, // how many seconds to wait before being able to call `execute`.
  scheduleDeposit: {
    token: ethers.constants.AddressZero,
    amount: 0,
  },
  challengeDeposit: {
    token: ethers.constants.AddressZero,
    amount: 0,
  },
  // resolver: daoDetails.queue.config.resolver,
  resolver: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
  rules: '0x',
  maxCalldataSize: 100000, // initial maxCalldatasize
};
