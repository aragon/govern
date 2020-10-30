usePlugin('solidity-coverage')
usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-etherscan')
usePlugin('@nomiclabs/buidler-waffle')

require('dotenv').config({ path: '../../.env' })

const getAccounts = require('./tasks/accounts')
const deployFactory = require('./tasks/deploy-factory')
const deployGovern = require('./tasks/deploy-govern')
const deployRegistry = require('./tasks/deploy-registry')

task('accounts', 'Prints the list of accounts', getAccounts)

task('create-action', async (_, { ethers }) => createAction(ethers))

task('deploy-registry', 'Deploys a GovernRegistry instance').setAction(
  deployRegistry
)

task('deploy-factory', 'Deploys a GovernBaseFactory instance').setAction(
  deployFactory
)

task('deploy-govern', 'Deploys an Govern from provided factory')
  .addOptionalParam('factory', 'Factory address')
  .addOptionalParam('useProxies', 'Whether to deploy govern with proxies')
  .addOptionalParam('name', 'DAO name (must be unique at Registry level)')
  .setAction(deployGovern)

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
      gasPrice: 3e9,
      accounts,
    },
    mainnet: {
      url: 'https://mainnet.eth.aragon.network',
      accounts,
    },
  },
}
