import { DaoConfig } from '@aragon/govern';
import { ChainId } from './types';

export const ARAGON_VOICE_URL: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://voice.aragon.org',
  [ChainId.RINKEBY]: 'http://voice-rinkeby.aragon.org/',
};

export const CONFIRMATION_WAIT = 3; // we wait 3 confirmation to make sure subgraph is populated

export const PROXY_CONTRACT_URL = 'https://eips.ethereum.org/EIPS/eip-1167';

export const INFURA_PROJECT_ID = '7a03fcb37be7479da06f92c5117afd47';
export const RINKEBY_NODE_URL = 'https://rinkeby.eth.aragon.network/';
export const ETHERSCAN_API_KEY = 'HS2AR94Q6G6RYIYHR7VRCZGP6E382K4BDC ';
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DEFAULT_DAO_CONFIG: { [chainId in ChainId]: DaoConfig } = {
  // TODO: "resolver" to be changed once it is available for mainnet
  [ChainId.MAINNET]: {
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

  [ChainId.RINKEBY]: {
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
};
