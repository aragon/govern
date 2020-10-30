const { readFileSync } = require('fs')
const { print } = require('../lib/utils')

const FACTORY_CACHE_NAME = 'govern-token-factory-rinkeby'
const CREATE_EVENT_NAME = 'CreatedToken'
const REGISTRY_EVENTS_ABI = [
  'event Registered(address indexed dao, address queue, address indexed registrant, string name)',
  'event SetMetadata(address indexed dao, bytes metadata)',
]

module.exports = async (
  {
    factory: factoryAddr,
    useProxies = false,
    minter: minterAddr = '0x1111a5f9decc25927037de55d2013d7ad30f1af0',
    mintForCreator = 1,
    name = 'Govern Token',
    symbol = 'GOV',
    decimals = 0
  },
  { ethers }
) => {
  factoryAddr =
    factoryAddr ||
    process.env.TOKEN_FACTORY_RINKEBY ||
    readFileSync(FACTORY_CACHE_NAME).toString()

  if (!factoryAddr) {
    return console.error(
      'Please provide factory address as --factory [addr] or add as TOKEN_FACTORY_[NETWORK] to your environment'
    )
  }

  const tokenFactory = await ethers.getContractAt('GovernTokenFactory', factoryAddr)
  const tx = await tokenFactory.newToken(minterAddr, name, symbol, decimals, useProxies, {
    gasLimit: useProxies ? 5e5 : 5e6,
  })

  const { events } = await tx.wait()
  const { token, minter } = events.find(({ event }) => event === 'CreatedToken').args

  print({ address: token }, 'GovernToken')
  print({ address: minter }, 'GovernMinter')

  if (mintForCreator > 0) {
    const minterContract = await ethers.getContractAt('GovernMinter', minter)
    await minterContract.mint(minterAddr, mintForCreator, '0x')
  }
}

