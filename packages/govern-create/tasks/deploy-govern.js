const { readFileSync } = require('fs')
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator')
const { print } = require('../lib/utils')

const FACTORY_CACHE_NAME = 'govern-factory-rinkeby'
const REGISTER_EVENT_NAME = 'Registered'
const REGISTRY_EVENTS_ABI = [
  'event Registered(address indexed dao, address queue, address indexed registrant, string name)',
  'event SetMetadata(address indexed dao, bytes metadata)',
]

module.exports = async (
  { factory: factoryAddr, useProxies, name },
  { ethers }
) => {
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

  const registryInterface = new ethers.utils.Interface(REGISTRY_EVENTS_ABI)

  const GovernBaseFactory = await ethers.getContractAt(
    'GovernBaseFactory',
    factoryAddr
  )
  const tx = await GovernBaseFactory.newDummyGovern(name, {
    gasLimit: 4000000,
  })

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
}
