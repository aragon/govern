import { HardhatUserConfig } from 'hardhat/config'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-abi-exporter'
import 'hardhat-typechain'
import 'solidity-coverage'

const ETH_KEY = process.env.ETH_KEY
const accounts = ETH_KEY ? ETH_KEY.split(',') : []

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.8',
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000, // TODO: target average DAO use
      },
    },
  },
  networks: {
    rinkeby: {
      url: 'https://rinkeby.eth.aragon.network',
      accounts,
    },
  },
}

export default config
