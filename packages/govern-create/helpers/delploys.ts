import {
  GovernFactory,
  GovernBaseFactory,
  GovernRegistry,
  GovernQueueFactory,
  GovernTokenFactory,
} from '../typechain'
import { verifyContract } from './etherscan-verification'
import { deployContract, NO_TOKEN, TWO_ADDRR, ZERO_ADDR } from './helpers'
import { logDeploy } from './logger'
import { eContractid } from './types'

export const deployGoverRegistry = async (
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernRegistry

  const instance = await deployContract<GovernRegistry>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(instance.address, [])
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
  }

  return instance
}

export const deployGoverQueueFactory = async (
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernQueueFactory

  const instance = await deployContract<GovernQueueFactory>(id, [])
  await instance.deployTransaction.wait()

  const queueBase = await instance.base()

  if (verify) {
    const dummyConfig = {
      executionDelay: '0',
      scheduleDeposit: [NO_TOKEN, '0'],
      challengeDeposit: [NO_TOKEN, '0'],
      resolver: ZERO_ADDR,
      rules: '0x',
    }

    await verifyContract(instance.address, [])
    await verifyContract(queueBase, [TWO_ADDRR, dummyConfig])
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
    logDeploy(eContractid.Queue, network, queueBase)
  }

  return instance
}

export const deployGoverFactory = async (network: string, verify?: boolean) => {
  const id = eContractid.GovernFactory

  const instance = await deployContract<GovernFactory>(id, [])
  await instance.deployTransaction.wait()

  const governBase = await instance.base()

  if (verify) {
    await verifyContract(instance.address, [])
    await verifyContract(governBase, [TWO_ADDRR])
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
    logDeploy(eContractid.Govern, network, governBase)
  }

  return instance
}

export const deployGoverTokenFactory = async (
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernTokenFactory

  const instance = await deployContract<GovernTokenFactory>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(instance.address, [])
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
  }

  return instance
}

export const deployGoverBaseFactory = async (
  [registry, governFactory, queueFactory, tokenFactory]: [
    string,
    string,
    string,
    string
  ],
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernBaseFactory
  const args = [registry, governFactory, queueFactory, tokenFactory]

  const instance = await deployContract<GovernBaseFactory>(id, args)
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(instance.address, args)
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
  }

  return instance
}
