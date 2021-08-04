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
      daoFactoryAddress: '0x897b8DeeA74AD703B6d3DA25ed9A3a23fC5629EF', // TODO: GIORGI update this
      governRegistryAddress: '0x4fe12c45ea84b1ae828615ccbc958c8e8f38edd8', // TODO: GIORGI update this,
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
        rules: 'No main agreement has been defined', // we use Bytes (ArrayLike<number>) instead of string hex
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
      daoFactoryAddress: '0xcdB2c9a8A978368596907580953988337Ff0971a',
      governRegistryAddress: '0x88D9cf7eA0f0E2F97d7BeEf51895fC67C0F598aA',
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
        rules: 'No main agreement has been defined',
        maxCalldataSize: 100000,
      },
      curatedTokens: {
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
      courtSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-court-v2-staging',
      courtUrl: 'https://court-rinkeby-staging.aragon.org/#',
      voiceUrl: 'http://voice-rinkeby.aragon.org/',
      daoFactoryAddress: '0x410ccCd05A55Da632fAC118cc11fCeC956C3FB2D',
      governRegistryAddress: '0x025d278032145E197fd50E320cdc2d44d0A2794D',
      defaultDaoConfig: {
        executionDelay: 180,
        scheduleDeposit: {
          token: '0x8F2Ac3fD1a9Ce7208eFff7C31aC0e2A98b0778f3',
          amount: '10000000000000000000',
        },
        challengeDeposit: {
          token: '0x8F2Ac3fD1a9Ce7208eFff7C31aC0e2A98b0778f3',
          amount: '10000000000000000000',
        },
        resolver: '0x9c003eC97676c30a041f128D671b3Db2f790c3E7',
        rules: 'No main agreement has been defined',
        maxCalldataSize: 100000,
      },
      curatedTokens: {
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
