import HRE from 'hardhat'
import fs from 'fs'
import { file } from 'tmp-promise'

export const SUPPORTED_ETHERSCAN_NETWORKS = ['mainnet', 'rinkeby']

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const verifyContract = async (
  address: string,
  constructorArguments: any[]
) => {
  const currentNetwork = HRE.network.name
  if (!process.env.ETHERSCAN_KEY) {
    throw Error('Missing process.env.ETHERSCAN_KEY.')
  }
  if (!SUPPORTED_ETHERSCAN_NETWORKS.includes(currentNetwork)) {
    throw Error(
      `Current network ${currentNetwork} not supported. Please change to one of the next networks: ${SUPPORTED_ETHERSCAN_NETWORKS.toString()}`
    )
  }

  try {
    console.warn(
      'Delaying Etherscan verification due their API can not find newly deployed contracts'
    )
    const msDelay = 3000
    const times = 30
    // Write a temporal file to host complex parameters for hardhat-etherscan https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-etherscan#complex-arguments
    const { fd, path, cleanup } = await file({
      prefix: 'verify-params-',
      postfix: '.js',
    })
    fs.writeSync(
      fd,
      `module.exports = ${JSON.stringify([...constructorArguments])};`
    )

    const params = {
      address: address,
      constructorArgs: path,
    }
    await runTaskWithRetry('verify', params, times, msDelay, cleanup)
  } catch (error) {}
}

export const runTaskWithRetry = async (
  task: string,
  params: any,
  times: number,
  msDelay: number,
  cleanup: () => void
) => {
  let counter = times
  await delay(msDelay)

  try {
    if (times) {
      await HRE.run(task, params)
      cleanup()
    } else {
      cleanup()
      console.error(
        'Errors after all the retries, check the logs for more information.'
      )
    }
  } catch (error) {
    counter--
    // This is not the ideal check, but it's all that's possible for now https://github.com/nomiclabs/hardhat/issues/1301
    if (!/already verified/i.test(error.message)) {
      console.log(`Retrying attemps: ${counter}.`)
      console.error(error.message)
      await runTaskWithRetry(task, params, counter, msDelay, cleanup)
    }
  }
}
