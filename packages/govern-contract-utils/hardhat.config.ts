import { HardhatUserConfig } from 'hardhat/config'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-typechain'
import 'solidity-coverage'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.8',
  },
  networks: {
    coverage: {
      url: 'http://localhost:8555',
    },
  },
}

export default config
