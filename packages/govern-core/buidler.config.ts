import { BuidlerConfig, task, usePlugin } from '@nomiclabs/buidler/config'
import dotenv from 'dotenv'
import { ethers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from 'unique-names-generator'

usePlugin('buidler-local-networks-config-plugin')
usePlugin('buidler-typechain')
usePlugin('solidity-coverage')
usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-etherscan')
usePlugin('@nomiclabs/buidler-waffle')

dotenv.config({ path: '../../.env' })

const FACTORY_CACHE_NAME = 'govern-factory-rinkeby'
const DEFAULT_REGISTRY_ADDRESS = '0x874E22352098748504C8a8644b1492436CB73E52'
const REGISTER_EVENT_NAME = 'Registered'
const REGISTRY_EVENTS_ABI = [
  'event Registered(address indexed dao, address queue, address indexed registrant, string name)',
  'event SetMetadata(address indexed dao, bytes metadata)'
]

const format = (address: string, name: string): string =>
  `- ${name}: https://rinkeby.etherscan.io/address/${address})`

const print = (contractAddress: string, name: string) =>
  console.log(format(contractAddress, name))

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.getAddress())
  }
})

// TODO:
// task('create-action', async (_, { ethers }) => createAction(ethers))

task('deploy-registry', 'Deploys an ERC3000Registry instance').setAction(
  async (_, { ethers }) => {
    const ERC3000Registry = await ethers.getContractFactory('ERC3000Registry')
    print((await ERC3000Registry.deploy()).address, 'ERC3000Registry')
  }
)

task('deploy-factory', 'Deploys an GovernFactory instance').setAction(
  async (_, { ethers }) => {
    const OptimisticQueueFactory = await ethers.getContractFactory(
      'OptimisticQueueFactory'
    )
    const GovernFactory = await ethers.getContractFactory('GovernFactory')

    const queueFactory = await OptimisticQueueFactory.deploy()
    print(queueFactory.address, 'OptimisticQueueFactory')

    const governFactory = await GovernFactory.deploy(
      process.env.REGISTRY_RINKEBY,
      queueFactory.address
    )
    print(governFactory.address, 'GovernFactory')

    if (process.env.CD) {
      writeFileSync(FACTORY_CACHE_NAME, governFactory.address)
    }
  }
)

task('deploy-govern', 'Deploys an Govern from provided factory')
  .addOptionalParam('factory', 'Factory address', process.env.FACTORY_RINKEBY)
  .addOptionalParam('useProxies', 'Whether to deploy govern with proxies')
  .addOptionalParam(
    'name',
    'DAO name (must be unique at Registry level)',
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 2,
      separator: '-'
    })
  )
  .setAction(async ({ factory: factoryAddr, useProxies, name }, { ethers }) => {
    name = process.env.CD ? `github-${name}` : name

    if (!factoryAddr) {
      try {
        name = readFileSync(FACTORY_CACHE_NAME).toString()
      } catch {
        return console.error(
          'Please provide factory address as --factory [addr] or add as FACTORY_[NETWORK] to your environment'
        )
      }
    }

    const registryInterface = new ethers.utils.Interface(REGISTRY_EVENTS_ABI)

    const governFactory = await ethers.getContractAt(
      'GovernFactory',
      factoryAddr
    )

    const tx = await governFactory.newDummyGovern(name, {
      gasLimit: 3500000
    })

    const { events } = await tx.wait()

    const {
      args: { dao, queue }
    } = (events as ethers.Event[])
      .filter(
        ({ address }) =>
          address === process.env.REGISTRY_RINKEBY || DEFAULT_REGISTRY_ADDRESS
      )
      .map(log => registryInterface.parseLog(log))
      .find(({ name }) => name === REGISTER_EVENT_NAME)!

    console.log(`----\nA wild new Govern named *${name}* appeared 🦅`)
    print(dao, 'Govern')
    print(queue, 'Queue')
  })

const config: BuidlerConfig = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: true,
      runs: 2000 // TODO: target average DAO use
    }
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5'
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  },
  localNetworksConfig: '~/.buidler/networks.ts',
  networks: {
    coverage: {
      url: 'http://localhost:8555',
      allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: 'https://rinkeby.eth.aragon.network'
    }
  }
}

export default config
