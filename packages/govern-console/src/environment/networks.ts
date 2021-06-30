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
      daoFactoryAddress: '0x897b8DeeA74AD703B6d3DA25ed9A3a23fC5629EF',
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
      withdrawalTokens: {
        DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
      daoFactoryAddress: '0x897b8DeeA74AD703B6d3DA25ed9A3a23fC5629EF',
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
      withdrawalTokens: {
        DAI: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
        USDT: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
        USDC: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
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
      daoFactoryAddress: '0xDC35Ba1799C5895322c29687A5f3b1c19767Dc9e',
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
      withdrawalTokens: {
        DAI: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
        USDT: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
        USDC: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      },
    },
  ],
]);

export function getNetworkConfig(name: EnvironmentName): EnvironmentConfig {
  return networks.get(name) as EnvironmentConfig;
}
