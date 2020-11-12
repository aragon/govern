module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: 'https://mainnet.infura.io/v3/<projectId>',
      },
    },
  },
}
