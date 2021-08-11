import { Bytes } from 'ethers';
export type EnvironmentName = 'mainnet' | 'rinkeby' | 'staging';
type ChainId = 1 | 4;

export type TokenSymbol = 'DAI' | 'USDT' | 'USDC';
type TokenAddress = string;

type Collateral = {
  token: string;
  amount: string;
};

export interface EnvironmentConfig {
  chainId: ChainId;
  networkName: string;
  subgraphUrl: string;
  courtSubgraphUrl: string;
  courtUrl: string;
  voiceUrl: string;
  daoFactoryAddress: string;
  governRegistryAddress: string;
  datafeedAPI: string;
  defaultDaoConfig: {
    executionDelay: number;
    scheduleDeposit: Collateral;
    challengeDeposit: Collateral;
    resolver: string;
    rules: string;
    maxCalldataSize: number;
  };
  curatedTokens: Record<TokenSymbol, TokenAddress>;
}
