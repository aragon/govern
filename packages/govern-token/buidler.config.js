usePlugin('solidity-coverage')
usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-etherscan')
// usePlugin('@nomiclabs/buidler-waffle')
usePlugin('@nomiclabs/buidler-truffle5')

require('dotenv').config({ path: '../../.env' })

const getAccounts = require('./tasks/accounts')
const deployFactory = require('./tasks/deploy-factory')
const deployToken = require('./tasks/deploy-token')

task('accounts', 'Prints the list of accounts', getAccounts)
task('deploy-factory', 'Deploys a GovernTokenFactory instance').setAction(deployFactory)
task('deploy-token', 'Uses factory to deploy a token and minter instances')
  .addOptionalParam('factory', 'Factory address')
  .addOptionalParam('useProxies', 'Whether to deploy token and minter with proxies')
  .addOptionalParam('name', 'Token name')
  .addOptionalParam('symbol', 'Token symbol')
  .addOptionalParam('decimals', 'Token decimals')
  .addOptionalParam('minter', 'Minter address')
  .addOptionalParam('mintForCreator', 'Amount of token to mint for creator')
  .setAction(deployToken)

task('create-action', async (_, { ethers }) => createAction(ethers))

const ETH_KEY = process.env.ETH_KEY
const accounts = ETH_KEY ? ETH_KEY.split(',') : ['']

module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: true,
      runs: 20000, // TODO: target average DAO use
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
