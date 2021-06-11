import { Bytes } from 'ethers';
export type EnvironmentName = 'mainnet' | 'rinkeby' | 'staging';
type ChainId = 1 | 4;

type Collateral = {
  token: string;
  amount: string;
};

export interface EnvironmentConfig {
  chainId: ChainId;
  networkName: string;
  subgraphUrl: string;
  voiceUrl: string;
  defaultDaoConfig: {
    executionDelay: number;
    scheduleDeposit: Collateral;
    challengeDeposit: Collateral;
    resolver: string;
    rules: Bytes;
    maxCalldataSize: number;
  };
}
