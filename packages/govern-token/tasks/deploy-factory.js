const { print } = require('../lib/utils')

module.exports = async (_, { ethers }) => {
  const GovernTokenFactory = await ethers.getContractFactory('GovernTokenFactory')
  
  const tokenFactory = await GovernTokenFactory.deploy()
  print(tokenFactory, 'GovernTokenFactory')
}
