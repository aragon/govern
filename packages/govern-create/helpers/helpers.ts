import { HardhatRuntimeEnvironment } from 'hardhat/types'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
import { Contract, Signer } from 'ethers'
import { promises } from 'fs'
import { Address, eContractid } from './types'
import { getDb } from './artifactsDb'
import {
  GovernBaseFactory,
  GovernFactory,
  GovernQueueFactory,
  GovernRegistry,
  GovernTokenFactory,
} from '../typechain'

export const writeObjectToFile = async (path: string, obj: object) =>
  await promises.writeFile(path, JSON.stringify(obj))

// Hardhat Runtime Environment
export let HRE: HardhatRuntimeEnvironment = {} as HardhatRuntimeEnvironment
export const setHRE = (_HRE: HardhatRuntimeEnvironment) => {
  HRE = _HRE
}

export const ZERO_ADDR = `0x${'00'.repeat(20)}`
export const TWO_ADDRR = `0x${'00'.repeat(19)}02`
export const NO_TOKEN = `0x${'00'.repeat(20)}`

export const getEthersSigners = async (): Promise<Signer[]> =>
  await Promise.all(await HRE.ethers.getSigners())

export const getEthersSignersAddresses = async (): Promise<Address[]> =>
  await Promise.all(
    (await HRE.ethers.getSigners()).map((signer) => signer.getAddress())
  )

export const deployContract = async <ContractType extends Contract>(
  contractName: string,
  args: any[]
): Promise<ContractType> =>
  (await (await HRE.ethers.getContractFactory(contractName)).deploy(
    ...args
  )) as ContractType

export const getContract = async <ContractType extends Contract>(
  contractName: string,
  contractAddress: string
): Promise<ContractType> =>
  (await (await HRE.ethers.getContractAt(contractName, contractAddress)).attach(
    contractAddress
  )) as ContractType

export const getGovernRegistry = async () => {
  const addressDeployed = (
    await getDb()
      .get(`${eContractid.GovernRegistry}.${HRE.network.name}`)
      .value()
  ).address
  return await getContract<GovernRegistry>(
    eContractid.GovernRegistry,
    addressDeployed
  )
}

export const getGovernQueueFactory = async () => {
  const addressDeployed = (
    await getDb()
      .get(`${eContractid.GovernQueueFactory}.${HRE.network.name}`)
      .value()
  ).address
  return await getContract<GovernQueueFactory>(
    eContractid.GovernQueueFactory,
    addressDeployed
  )
}

export const getGovernFactory = async () => {
  const addressDeployed = (
    await getDb()
      .get(`${eContractid.GovernFactory}.${HRE.network.name}`)
      .value()
  ).address
  return await getContract<GovernFactory>(
    eContractid.GovernFactory,
    addressDeployed
  )
}

export const getGovernTokenFactory = async () => {
  const addressDeployed = (
    await getDb()
      .get(`${eContractid.GovernTokenFactory}.${HRE.network.name}`)
      .value()
  ).address
  return await getContract<GovernTokenFactory>(
    eContractid.GovernTokenFactory,
    addressDeployed
  )
}

export const getGovernBaseFactory = async () => {
  const addressDeployed = (
    await getDb()
      .get(`${eContractid.GovernBaseFactory}.${HRE.network.name}`)
      .value()
  ).address
  return await getContract<GovernBaseFactory>(
    eContractid.GovernBaseFactory,
    addressDeployed
  )
}

export const buildName = (name: string | null): string => {
  const uniqueName =
    name ??
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 2,
      separator: '-',
    })

  return process.env.CD ? `github-${uniqueName}` : uniqueName
}
