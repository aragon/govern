const { print } = require('../lib/utils')

module.exports = async (_, { ethers }) => {
  const ERC3000Registry = await ethers.getContractFactory('ERC3000Registry')
  print(await ERC3000Registry.deploy(), 'ERC3000Registry')
}
