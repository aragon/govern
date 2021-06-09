import { EnvironmentConfig, EnvironmentName } from './types';

const networks = new Map<EnvironmentName, EnvironmentConfig>([
  [
    'mainnet',
    {
      chainId: 1,
      networkName: 'mainnet',
      endpoints: {
        ethereum: 'https://mainnet.eth.aragon.network/',
        ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
        subgraph: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet',
      },
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      networkName: 'rinkeby',
      endpoints: {
        ethereum: 'https://rinkeby.eth.aragon.network/',
        ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
        subgraph: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby',
      },
    },
  ],
  [
    'staging',
    {
      chainId: 4,
      networkName: 'rinkeby',
      endpoints: {
        ethereum: 'https://rinkeby.eth.aragon.network/',
        ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
        subgraph: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby-staging',
      },
    },
  ],
]);

export function getNetworkConfig(name: EnvironmentName): EnvironmentConfig {
  return networks.get(name) as EnvironmentConfig;
}
