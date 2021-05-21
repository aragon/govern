import { DaoConfig } from '@aragon/govern';
import { ChainId } from './types';
import { toUtf8Bytes } from '@ethersproject/strings';

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
    rules: toUtf8Bytes('No main agreement has been defined'), // we use Bytes (ArrayLike<number>) instead of string hex
    maxCalldataSize: 100000, // initial maxCalldatasize
  },

  [ChainId.RINKEBY]: {
    executionDelay: 180,
    scheduleDeposit: {
      token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      amount: '1000',
    },
    challengeDeposit: {
      token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      amount: '1000',
    },
    resolver: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
    rules: toUtf8Bytes('No main agreement has been defined'),
    maxCalldataSize: 100000,
  },
};
