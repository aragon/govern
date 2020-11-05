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
import { GovernBaseFactory, GovernRegistry } from '../typechain'

export const writeObjectToFile = async (path: string, obj: object) =>
  await promises.writeFile(path, JSON.stringify(obj))

// Hardhat Runtime Environment
export let BRE: HardhatRuntimeEnvironment = {} as HardhatRuntimeEnvironment
export const setBRE = (_BRE: HardhatRuntimeEnvironment) => {
  BRE = _BRE
}

export const getEthersSigners = async (): Promise<Signer[]> =>
  await Promise.all(await BRE.ethers.getSigners())

export const getEthersSignersAddresses = async (): Promise<Address[]> =>
  await Promise.all(
    (await BRE.ethers.getSigners()).map((signer) => signer.getAddress())
  )

export const deployContract = async <ContractType extends Contract>(
  contractName: string,
  args: any[]
): Promise<ContractType> =>
  (await (await BRE.ethers.getContractFactory(contractName)).deploy(
    ...args
  )) as ContractType

export const getContract = async <ContractType extends Contract>(
  contractName: string,
  contractAddress: string
): Promise<ContractType> =>
  (await (await BRE.ethers.getContractAt(contractName, contractAddress)).attach(
    contractAddress
  )) as ContractType

export const getGovernRegistry = async () => {
  const addressDeployed = (
    await getDb()
      .get(`${eContractid.GovernRegistry}.${BRE.network.name}`)
      .value()
  ).address
  return await getContract<GovernRegistry>(
    eContractid.GovernRegistry,
    addressDeployed
  )
}

export const getGovernBaseFactory = async () => {
  const addressDeployed = (
    await getDb()
      .get(`${eContractid.GovernBaseFactory}.${BRE.network.name}`)
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
