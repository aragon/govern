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

export async function writeObjectToFile(path: string, obj: object) {
  return promises.writeFile(path, JSON.stringify(obj))
}

// Hardhat Runtime Environment
export let HRE: HardhatRuntimeEnvironment = {} as HardhatRuntimeEnvironment
export function setHRE(_HRE: HardhatRuntimeEnvironment) {
  HRE = _HRE
}

export const ZERO_ADDR = `0x${'00'.repeat(20)}`
export const TWO_ADDRR = `0x${'00'.repeat(19)}02`
export const NO_TOKEN = `0x${'00'.repeat(20)}`

export async function getEthersSigners(): Promise<Signer[]> {
  return Promise.all(await HRE.ethers.getSigners())
}

export async function getEthersSignersAddresses(): Promise<Address[]> {
  const signers = await HRE.ethers.getSigners()
  return Promise.all(signers.map((signer) => signer.getAddress()))
}

export async function deployContract<ContractType extends Contract>(
  contractName: string,
  args: any[]
): Promise<ContractType> {
  const factory = await HRE.ethers.getContractFactory(contractName)
  const deployedFactory = await factory.deploy(...args)
  return deployedFactory as ContractType
}

export async function getContract<ContractType extends Contract>(
  contractName: string,
  contractAddress: string
): Promise<ContractType> {
  const contract = await HRE.ethers.getContractAt(contractName, contractAddress)
  const attachedContract = await contract.attach(contractAddress)
  return attachedContract as ContractType
}

export async function getGovernRegistry() {
  const registry = await getDb()
    .get(`${eContractid.GovernRegistry}.${HRE.network.name}`)
    .value()
  return getContract<GovernRegistry>(
    eContractid.GovernRegistry,
    registry.address
  )
}

export async function getGovernQueueFactory() {
  const queueFactory = await getDb()
    .get(`${eContractid.GovernQueueFactory}.${HRE.network.name}`)
    .value()
  return getContract<GovernQueueFactory>(
    eContractid.GovernQueueFactory,
    queueFactory.address
  )
}

export async function getGovernFactory() {
  const factory = await getDb()
    .get(`${eContractid.GovernFactory}.${HRE.network.name}`)
    .value()
  return getContract<GovernFactory>(eContractid.GovernFactory, factory.address)
}

export async function getGovernTokenFactory() {
  const tokenFactory = await getDb()
    .get(`${eContractid.GovernTokenFactory}.${HRE.network.name}`)
    .value()
  return getContract<GovernTokenFactory>(
    eContractid.GovernTokenFactory,
    tokenFactory.address
  )
}

export async function getGovernBaseFactory() {
  const baseFactory = await getDb()
    .get(`${eContractid.GovernBaseFactory}.${HRE.network.name}`)
    .value()
  return getContract<GovernBaseFactory>(
    eContractid.GovernBaseFactory,
    baseFactory.address
  )
}

export function buildName(name: string | null): string {
  const uniqueName =
    name ??
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 2,
      separator: '-',
    })

  return process.env.CD ? `github-${uniqueName}` : uniqueName
}
