/* eslint-disable */
export const ARAGON_VOICE_URL = {
  1: 'https://voice.aragon.org', // mainnet
  4: 'http://voice-rinkeby.aragon.org/', // rinkeby
};

export const PROXY_CONTRACT_URL = 'https://eips.ethereum.org/EIPS/eip-1167';

export const DEFAULT_DAO_CONFIG = {
  1: {
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
    rules: 'No main agreement has been defined',
    maxCalldataSize: 100000, // initial maxCalldatasize
  },
  // TODO: "resolver" to be changed once it is available for mainnet
  4: {
    executionDelay: 86400, // defaults to one day - how many seconds to wait before being able to call execute.
    scheduleDeposit: {
      token: '0xb08E32D658700f768f5bADf0679E153ffFEC42e6',
      amount: '10000000000000000000',
    },
    challengeDeposit: {
      token: '0xb08E32D658700f768f5bADf0679E153ffFEC42e6',
      amount: '10000000000000000000',
    },
    resolver: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
    rules: 'No main agreement has been defined',
    maxCalldataSize: 100000, // initial maxCalldatasize
  },
};
