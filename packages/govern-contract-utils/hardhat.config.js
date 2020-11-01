require('@nomiclabs/hardhat-waffle')

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.getAddress())
  }
})

module.exports = {
  solidity: {
    version: '0.6.8',
  },
}
