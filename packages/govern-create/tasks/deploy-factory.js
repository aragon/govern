const { writeFileSync } = require('fs')
const { print } = require('../lib/utils')

const FACTORY_CACHE_NAME = 'govern-factory-rinkeby'

module.exports = async (_, { ethers }) => {
  const GovernFactory = await ethers.getContractFactory('GovernFactory')
  const GovernQueueFactory = await ethers.getContractFactory('GovernQueueFactory')
  const GovernTokenFactory = await ethers.getContractFactory('GovernTokenFactory')
  const GovernBaseFactory = await ethers.getContractFactory('GovernBaseFactory')

  const governFactory = await GovernFactory.deploy()
  print(governFactory, 'GovernFactory')

  const queueFactory = await GovernQueueFactory.deploy()
  print(queueFactory, 'GovernQueueFactory')

  const tokenFactory = await GovernTokenFactory.deploy()
  print(tokenFactory, 'GovernTokenFactory')

  const governBaseFactory = await GovernBaseFactory.deploy(
    process.env.REGISTRY_RINKEBY,
    governFactory.address,
    queueFactory.address,
    tokenFactory.address
  )
  print(governBaseFactory, 'GovernBaseFactory')

  if (process.env.CD) {
    writeFileSync(FACTORY_CACHE_NAME, governBaseFactory.address)
  }
}
