import { EnvironmentConfig, EnvironmentName } from './types';

const networks = new Map<EnvironmentName, EnvironmentConfig>([
  [
    'mainnet',
    {
      chainId: 1,
      networkName: 'mainnet',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet',
      courtSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-court-v2-mainnet',
      courtUrl: 'https://court.aragon.org/#',
      voiceUrl: 'https://voice.aragon.org/',
      daoFactoryAddress: '0x8bF05ce17B30f8C73B06e49f67076f944687c967',
      governRegistryAddress: '0xf2b7D096cd34F228A6413e276132C21D98b19882',
      defaultDaoConfig: {
        executionDelay: 604800, // defaults to 7 day - how many seconds to wait before being able to call execute.
        scheduleDeposit: {
          token: '0x6b175474e89094c44da98b954eedeac495271d0f',
          amount: '10000000000000000000',
        },
        challengeDeposit: {
          token: '0x6b175474e89094c44da98b954eedeac495271d0f',
          amount: '10000000000000000000',
        },
        resolver: '0xFb072baA713B01cE944A0515c3e1e98170977dAF',
        rules:
          'Any transaction created in this DAO must have first been proposed in an Aragon Voice vote on https://voice.aragon.org/ and with the following approval criteria:\n\n67% support of the participating tokens in the vote proposal duration of at least 3 days.\n\nTransactions created that do not meet the above criteria should not be permitted.', // we use Bytes (ArrayLike<number>) instead of string hex
        maxCalldataSize: 100000, // initial maxCalldatasize
      },
      curatedTokens: {
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
      courtSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-court-v2-rinkeby',
      courtUrl: 'https://court-rinkeby.aragon.org/#',
      voiceUrl: 'http://voice-rinkeby.aragon.org/',
      daoFactoryAddress: '0x46013753f3a02ab4239cA936632E6C6B39235CCE',
      governRegistryAddress: '0xf46253ef29FaedAbf63AA8cA6c0A41CbbdC93948',
      defaultDaoConfig: {
        executionDelay: 3600, // 1 Hour
        scheduleDeposit: {
          token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
          amount: '10000000000000000000',
        },
        challengeDeposit: {
          token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
          amount: '10000000000000000000',
        },
        resolver: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
        rules:
          'Any transaction created in this DAO must have first been proposed in an Aragon Voice vote on https://voice.aragon.org/ and with the following approval criteria:\n\n67% support of the participating tokens in the vote proposal duration of at least 3 days.\n\nTransactions created that do not meet the above criteria should not be permitted.', // we use Bytes (ArrayLike<number>) instead of string hex
        maxCalldataSize: 100000,
      },
      curatedTokens: {
        DAI: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
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
      courtSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-court-v2-staging',
      courtUrl: 'https://court-rinkeby-staging.aragon.org/#',
      voiceUrl: 'http://voice-rinkeby.aragon.org/',
      daoFactoryAddress: '0x0f75Dd5E00f0A153fCee92A1C242Dbdf32D87196',
      governRegistryAddress: '0xcc3F32957d316a12AFCFed04c0716af4814eCB2B',
      defaultDaoConfig: {
        executionDelay: 180, // 3 minutes
        scheduleDeposit: {
          token: '0x8F2Ac3fD1a9Ce7208eFff7C31aC0e2A98b0778f3',
          amount: '10000000000000000000',
        },
        challengeDeposit: {
          token: '0x8F2Ac3fD1a9Ce7208eFff7C31aC0e2A98b0778f3',
          amount: '10000000000000000000',
        },
        resolver: '0x9c003eC97676c30a041f128D671b3Db2f790c3E7',
        rules:
          'Any transaction created in this DAO must have first been proposed in an Aragon Voice vote on https://voice.aragon.org/ and with the following approval criteria:\n\n67% support of the participating tokens in the vote proposal duration of at least 3 days.\n\nTransactions created that do not meet the above criteria should not be permitted.', // we use Bytes (ArrayLike<number>) instead of string hex
        maxCalldataSize: 100000,
      },
      curatedTokens: {
        DAI: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        USDT: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
        USDC: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      },
    },
  ],
]);

export function getNetworkConfig(name: EnvironmentName): EnvironmentConfig {
  return networks.get(name) as EnvironmentConfig;
}
