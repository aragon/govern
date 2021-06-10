import { EnvironmentConfig, EnvironmentName } from './types';
import { utils } from 'ethers';

const networks = new Map<EnvironmentName, EnvironmentConfig>([
  [
    'mainnet',
    {
      chainId: 1,
      networkName: 'mainnet',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet',
      voiceUrl: 'https://voice.aragon.org/',
      defaultDaoConfig: {
        executionDelay: 86400, // defaults to one day - how many seconds to wait before being able to call execute.
        scheduleDeposit: {
          token: '0x6b175474e89094c44da98b954eedeac495271d0f',
          amount: '10000000000000000000',
        },
        challengeDeposit: {
          token: '0x6b175474e89094c44da98b954eedeac495271d0f',
          amount: '10000000000000000000',
        },
        resolver: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
        rules: utils.toUtf8Bytes('No main agreement has been defined'), // we use Bytes (ArrayLike<number>) instead of string hex
        maxCalldataSize: 100000, // initial maxCalldatasize
      },
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      networkName: 'rinkeby',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby',
      voiceUrl: 'http://voice-rinkeby.aragon.org/',
      defaultDaoConfig: {
        executionDelay: 180,
        scheduleDeposit: {
          token: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
          amount: '10000000000000000000',
        },
        challengeDeposit: {
          token: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
          amount: '10000000000000000000',
        },
        resolver: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
        rules: utils.toUtf8Bytes('No main agreement has been defined'),
        maxCalldataSize: 100000,
      },
    },
  ],
  [
    'staging',
    {
      chainId: 4,
      networkName: 'rinkeby',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby-staging',
      voiceUrl: 'http://voice-rinkeby.aragon.org/',
      defaultDaoConfig: {
        executionDelay: 180,
        scheduleDeposit: {
          token: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
          amount: '10000000000000000000',
        },
        challengeDeposit: {
          token: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
          amount: '10000000000000000000',
        },
        resolver: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
        rules: utils.toUtf8Bytes('No main agreement has been defined'),
        maxCalldataSize: 100000,
      },
    },
  ],
]);

export function getNetworkConfig(name: EnvironmentName): EnvironmentConfig {
  return networks.get(name) as EnvironmentConfig;
}
