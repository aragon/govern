const { task } = require('hardhat/config')
const { print } = require('../lib/utils')
const { BigNumber } = require('ethers')

function decimalAmount(amount, decimals) {
  return BigNumber.from(amount).mul(
    BigNumber.from(10).pow(BigNumber.from(decimals))
  )
}

/**
 * NOTE:
 * initialminter and minteraddress can be different. so we have to provide them separately.
 *
 * As an example of how to run this task:
 * yarn deploy-token --initialminter 0x94C34FB5025e054B24398220CBDaBE901bd8eE5e --minteraddress 0x94C34FB5025e054B24398220CBDaBE901bd8eE5e --mintamount 100
 */
task('deploy-token', 'Uses factory to deploy a token and minter instances')
  .addOptionalParam('factory', 'Factory address')
  .addOptionalParam('initialminter', 'Initial Minter Address')
  .addOptionalParam('name', 'Token name')
  .addOptionalParam('symbol', 'Token symbol')
  .addOptionalParam('decimals', 'Token decimals')
  .addOptionalParam('minteraddress', 'Minter address')
  .addOptionalParam('mintamount', 'Amount of token to mint for the mintAddress')
  .addOptionalParam(
    'useProxies',
    'Whether to deploy token and minter with proxies'
  )
  .setAction(
    async (
      {
        factory: factoryAddr,
        initialminter: initialMinter,
        name: name = 'Govern Token',
        symbol: symbol = 'GOV',
        decimals: decimals = 18,
        minteraddress: minterAddress,
        mintamount: mintAmount = 0,
        useProxies: useProxies = false,
      },
      HRE
    ) => {
      const { ethers, deployments } = HRE

      const tokenFactoryDeployment = await deployments.get('GovernTokenFactory')
      const tokenFactory = factoryAddr
        ? await ethers.getContractAt('GovernTokenFactory', factoryAddr)
        : await ethers.getContractAt(
            'GovernTokenFactory',
            tokenFactoryDeployment.address
          )

      mintAmount = decimalAmount(mintAmount, decimals)

      const tx = await tokenFactory.newToken(
        initialMinter,
        name,
        symbol,
        decimals,
        minterAddress,
        mintAmount,
        useProxies,
        {
          gasLimit: useProxies ? 5e5 : 5e6,
        }
      )

      const { events } = await tx.wait()
      const { token, minter } = events.find(
        ({ event }) => event === 'CreatedToken'
      ).args

      print({ address: token }, 'GovernToken')
      print({ address: minter }, 'GovernMinter')
    }
  )
