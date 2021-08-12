import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
dotenvConfig({ path: resolve(__dirname, './.env') })

import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-deploy'
import 'hardhat-typechain'
import 'solidity-coverage'
import './tasks/govern'
import './tasks/ens'

import { node_url, accounts, RINKEBY_URL } from './utils/network'

const PRIV_KEYS = process.env.PRIVATE_KEY
  ? [`0x${process.env.PRIVATE_KEY}`]
  : []

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.8',
    settings: {
      optimizer: {
        enabled: true,
        runs: 20000, // TODO: target average DAO use
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
    // WQ7EFJVI6QCN9XKY3ET6IS4S7IX8CJ8QCW TODO:GIORGI remove later
  },
  networks: {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
      // tests that deploy new tokens with proxies set to false, require more than 8,000,000 GAS.
      // Without setting this,tests do fail due to out of gas error
      gas: 10000000,
      accounts: accounts(),
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: accounts(),
    },
    coverage: {
      url: 'http://localhost:8555',
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/7a03fcb37be7479da06f92c5117afd47',
      accounts: PRIV_KEYS,
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/7a03fcb37be7479da06f92c5117afd47',
      accounts: PRIV_KEYS,
    },
    rinkeby_staging: {
      url: 'https://rinkeby.infura.io/v3/7a03fcb37be7479da06f92c5117afd47',
      accounts: PRIV_KEYS,
    },
  },
}

export default config
