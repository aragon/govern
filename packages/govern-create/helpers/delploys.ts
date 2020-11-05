import {
  FactoryGovern,
  FactoryGovernQueue,
  FactoryGovernToken,
  GovernBaseFactory,
  GovernRegistry,
} from '../typechain'
import { verifyContract } from './etherscan-verification'
import { deployContract } from './helpers'
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

export const deployGoverFactory = async (network: string, verify?: boolean) => {
  const id = eContractid.FactoryGovern

  const instance = await deployContract<FactoryGovern>(id, [])
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
  const id = eContractid.FactoryGovernQueue

  const instance = await deployContract<FactoryGovernQueue>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(instance.address, [])
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
  }

  return instance
}

export const deployGoverTokenFactory = async (
  network: string,
  verify?: boolean
) => {
  const id = eContractid.FactoryGovernToken

  const instance = await deployContract<FactoryGovernToken>(id, [])
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
  [registry, factoryGovern, queueDeployer, tokenDeployer]: [
    string,
    string,
    string,
    string
  ],
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernBaseFactory
  const args = [registry, factoryGovern, queueDeployer, tokenDeployer]

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
