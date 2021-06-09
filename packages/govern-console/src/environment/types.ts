export type EnvironmentName = 'mainnet' | 'rinkeby' | 'staging';
type ChainId = 1 | 4;

export interface EnvironmentConfig {
  chainId: ChainId;
  networkName: string;
  endpoints: {
    ethereum: string;
    ipfsGateway: string;
    subgraph: string;
  };
}
