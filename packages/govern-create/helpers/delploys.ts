import {
  GovernDeployer,
  GovernBaseFactory,
  GovernRegistry,
  GovernQueueDeployer,
  GovernTokenDeployer,
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

export const deployGoverDeployer = async (
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernDeployer

  const instance = await deployContract<GovernDeployer>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(instance.address, [])
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
  }

  return instance
}

export const deployGoverQueueDeployer = async (
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernQueueDeployer

  const instance = await deployContract<GovernQueueDeployer>(id, [])
  await instance.deployTransaction.wait()

  if (verify) {
    await verifyContract(instance.address, [])
  }

  if (network !== 'hardhat' && network !== 'soliditycoverage') {
    logDeploy(id, network, instance.address)
  }

  return instance
}

export const deployGoverTokenDeployer = async (
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernTokenDeployer

  const instance = await deployContract<GovernTokenDeployer>(id, [])
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
  [registry, governDeployer, queueDeployer, tokenDeployer]: [
    string,
    string,
    string,
    string
  ],
  network: string,
  verify?: boolean
) => {
  const id = eContractid.GovernBaseFactory
  const args = [registry, governDeployer, queueDeployer, tokenDeployer]

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
