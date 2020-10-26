usePlugin('solidity-coverage')
usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-etherscan')
usePlugin('@nomiclabs/buidler-waffle')

require('dotenv').config({ path: '../../.env' })

const { readFileSync, writeFileSync } = require('fs')
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator')

const FACTORY_CACHE_NAME = 'govern-factory-rinkeby'
const REGISTER_EVENT_NAME = 'Registered'
const REGISTRY_EVENTS_ABI = [
  'event Registered(address indexed dao, address queue, address indexed registrant, string name)',
  'event SetMetadata(address indexed dao, bytes metadata)',
]

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.getAddress())
  }
})

const format = ({ address }, name) =>
  `- ${name}: https://rinkeby.etherscan.io/address/${address}`

const print = (contract, name) => console.log(format(contract, name))

task('create-action', async (_, { ethers }) => createAction(ethers))

task('deploy-registry', 'Deploys an ERC3000Registry instance').setAction(
  async (_, { ethers }) => {
    const ERC3000Registry = await ethers.getContractFactory('ERC3000Registry')
    print(await ERC3000Registry.deploy(), 'ERC3000Registry')
  }
)

task('deploy-factory', 'Deploys an GovernBaseFactory instance').setAction(
  async (_, { ethers }) => {
    const GovernFactory = await ethers.getContractFactory('GovernFactory')
    const GovernQueueFactory = await ethers.getContractFactory('GovernQueueFactory')
    const GovernBaseFactory = await ethers.getContractFactory('GovernBaseFactory')
    
    const governFactory = await GovernFactory.deploy()
    print(governFactory, 'GovernFactory')

    const queueFactory = await GovernQueueFactory.deploy()
    print(queueFactory, 'GovernQueueFactory')

    const governBaseFactory = await GovernBaseFactory.deploy(
      process.env.REGISTRY_RINKEBY,
      governFactory.address,
      queueFactory.address
    )
    print(governBaseFactory, 'GovernBaseFactory')

    if (process.env.CD) {
      writeFileSync(FACTORY_CACHE_NAME, governBaseFactory.address)
    }
  }
)

task('deploy-govern', 'Deploys an Govern from provided factory')
  .addOptionalParam('factory', 'Factory address')
  .addOptionalParam('useProxies', 'Whether to deploy govern with proxies')
  .addOptionalParam('name', 'DAO name (must be unique at Registry level)')
  .setAction(async ({ factory: factoryAddr, useProxies = true, name }, { ethers }) => {
    factoryAddr =
      factoryAddr ||
      process.env.FACTORY_RINKEBY ||
      readFileSync(FACTORY_CACHE_NAME).toString()
    name =
      name ||
      uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 2,
        separator: '-',
      })
    name = process.env.CD ? `github-${name}` : name

    if (!factoryAddr) {
      return console.error(
        'Please provide factory address as --factory [addr] or add as FACTORY_[NETWORK] to your environment'
      )
    }

    let registryInterface = new ethers.utils.Interface(REGISTRY_EVENTS_ABI)

    const governBaseFactory = await ethers.getContractAt('GovernBaseFactory', factoryAddr)
    const tx = await governBaseFactory.newDummyGovern(name, useProxies, { gasLimit: useProxies ? 7e5 : 5e6 })

    const { events } = await tx.wait()

    const {
      args: { dao, queue },
    } = events
      .filter(({ address }) => address === process.env.REGISTRY_RINKEBY)
      .map((log) => registryInterface.parseLog(log))
      .find(({ name }) => name === REGISTER_EVENT_NAME)

    console.log(`----\nA wild new Govern named *${name}* appeared 🦅`)
    print({ address: dao }, 'Govern')
    print({ address: queue }, 'Queue')
  })

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
