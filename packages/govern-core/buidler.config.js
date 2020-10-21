usePlugin('solidity-coverage')
usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-etherscan')
usePlugin('@nomiclabs/buidler-waffle')

require('dotenv').config({ path: '../../.env' })

const ETH_KEY = process.env.ETH_KEY
const accounts = ETH_KEY ? ETH_KEY.split(',') : ['']

module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: true,
      runs: 2000, // TODO: target average DAO use
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  networks: {
    coverage: {
      url: 'http://localhost:8555',
      allowUnlimitedContractSize: true,
    },
    rinkeby: {
      url: 'https://rinkeby.eth.aragon.network',
      accounts,
    },
  },
}
