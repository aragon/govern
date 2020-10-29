const { print } = require('../lib/utils')

module.exports = async (_, { ethers }) => {
  const GovernRegistry = await ethers.getContractFactory('GovernRegistry')
  print(await GovernRegistry.deploy(), 'GovernRegistry')
}
