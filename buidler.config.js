usePlugin("solidity-coverage")
usePlugin("@nomiclabs/buidler-ethers")
usePlugin("@nomiclabs/buidler-etherscan")
usePlugin("@nomiclabs/buidler-waffle")

require('dotenv').config()
const { readFileSync, writeFileSync } = require('fs')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator')

const { sendMessage: discordSend } = require('./lib/discord')(process.env.DISCORD_CHANNEL, process.env.DISCORD_TOKEN)

const FACTORY_CACHE_NAME = 'eaglet-factory-rinkeby'
const REGISTER_EVENT_NAME = 'Registered'
const REGISTRY_EVENTS_ABI = [
  'event Registered(address indexed dao, address queue, address indexed registrant, string name)',
  'event SetMetadata(address indexed dao, bytes metadata)'
]

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
})

const format = ({ address }, name) =>
  `- ${name}: [\`${address}\`](https://rinkeby.etherscan.io/address/${address})`

const print = (contract, name) =>
  console.log(format(contract, name))

const discordPrint = (contract, name) =>
  discordSend(format(contract, name))

task("deploy-registry", "Deploys an ERC3000Registry instance").setAction(
  async (_, { ethers }) => {
    const ERC3000Registry = await ethers.getContractFactory("ERC3000Registry")
    print(await ERC3000Registry.deploy(), 'ERC3000Registry')
  }
)

task("deploy-factory", "Deploys an EagletFactory instance").setAction(
  async (_, { ethers }) => {
    const OptimisticQueueFactory = await ethers.getContractFactory("OptimisticQueueFactory")
    const EagletFactory = await ethers.getContractFactory("EagletFactory")

    const queueFactory = await OptimisticQueueFactory.deploy()
    print(queueFactory, 'OptimisticQueueFactory')

    const eagletFactory = await EagletFactory.deploy(process.env.REGISTRY_RINKEBY, queueFactory.address)
    print(eagletFactory, 'EagletFactory')

    if (process.env.CD) {
      writeFileSync(FACTORY_CACHE_NAME, eagletFactory.address)
    }
  }
)

task("deploy-eaglet", "Deploys an Eaglet from provided factory")
  .addOptionalParam('factory', 'Factory address')
  .addOptionalParam('useProxies', 'Whether to deploy eaglet with proxies')
  .addOptionalParam('name', 'DAO name (must be unique at Registry level)')
  .setAction(async ({ factory: factoryAddr, useProxies, name }, { ethers }) => {
    factoryAddr = factoryAddr || process.env.FACTORY_RINKEBY || readFileSync(FACTORY_CACHE_NAME).toString()
    name = name
      || uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 2,
        separator: '-'
      })

    if (!factoryAddr) {
      return console.error('Please provide factory address as --factory [addr] or add as FACTORY_[NETWORK] to your environment')
    }

    let registryInterface = new ethers.utils.Interface(REGISTRY_EVENTS_ABI)

    const eagletFactory = await ethers.getContractAt('EagletFactory', factoryAddr)
    const tx = await eagletFactory.newDummyEaglet(name)

    const { events } = await tx.wait()

    const { args: { dao, queue }} = events
      .filter(({ address }) => address === process.env.REGISTRY_RINKEBY)
      .map(log => registryInterface.parseLog(log))
      .find(({ name }) => name === REGISTER_EVENT_NAME)

    console.log(`----A wild new Eaglet named *${name}* appeared 🐥`)
    print({ address: dao }, 'Eaglet')
    print({ address: queue }, 'Queue')

    await discordSend(`A wild new Eaglet named *${name}* appeared 🐥`)
    await discordPrint({ address: dao }, 'Eaglet')
    await discordPrint({ address: queue }, 'Queue')
  }
)

const ETH_KEY = process.env.ETH_KEY
const accounts = ETH_KEY ? ETH_KEY.split(",") : [""]

module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: "0.6.8",
    optimizer: {
      enabled: true,
      runs: 2000     // TODO: target average DAO use
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  networks: {
    coverage: {
      url: "http://localhost:8555",
      allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: "https://rinkeby.eth.aragon.network",
      accounts
    },
  },
};
