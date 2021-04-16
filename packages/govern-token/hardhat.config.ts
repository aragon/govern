import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-abi-exporter'
import 'hardhat-deploy'
import 'hardhat-typechain'
import 'solidity-coverage'
import './tasks/token'

dotenvConfig({ path: resolve(__dirname, './.env') })

const PRIV_KEYS = process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.8',
    settings: {
      optimizer: {
        enabled: true,
        runs: 20000,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },

  networks: {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
      accounts: {
          mnemonic: 'test test test test test test test test test test test junk'
      }
    },
    coverage: {
      url: 'http://localhost:8555',
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      url: 'https://mainnet.eth.aragon.network',
      accounts: PRIV_KEYS
    },
    rinkeby: {
      url: 'https://rinkeby.eth.aragon.network',
      accounts: PRIV_KEYS
    },
  },
}

export default config
