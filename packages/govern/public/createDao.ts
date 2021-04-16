import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import Configuration from '../internal/configuration/Configuration'
import * as factoryAbi from '../internal/abi/FactoryAbi.json'

declare let window: any

export type Token = {
  tokenAddress: string
  tokenDecimals: number
  tokenName: string
  tokenSymbol: string
}

export type DaoConfig = {
  executionDelay: number
  scheduleDeposit: {
    token: string
    amount: number
  }
  challengeDeposit: {
    token: string
    amount: number
  }
  resolver: string
  rules: string
  maxCalldataSize: number
}

export type CreateDaoParams = {
  name: string
  token: Partial<Token>
  config: DaoConfig
  useProxies?: boolean
  useVocdoni?: boolean // not used yet
}

export type CreateDaoOptions = {
  provider?: any
  daoFactoryAddress?: string
}

/**
 * Create a Dao by the given name and token
 *
 * @param {args} parameters for DAO creation
 *
 * @param {options} options to overwrite with eip1193 provider and DAO factory address
 *
 * @returns {Promise<TransactionResponse>} transaction response object
 */
export async function createDao(
  args: CreateDaoParams,
  options: CreateDaoOptions = {}
): Promise<TransactionResponse> {
  if (!args.token.tokenAddress) {
    args.token.tokenAddress = AddressZero
  } else {
    args.token = {
      tokenDecimals: 0,
      tokenName: '',
      tokenSymbol: '',
      ...args.token,
    }
  }

  const addressIsZero = args.token.tokenAddress === AddressZero
  const tokenIsMissingInfo = !args.token.tokenName || !args.token.tokenSymbol

  if (addressIsZero && tokenIsMissingInfo) {
    throw new Error('Missing token name and/or symbol')
  }

  const config = Configuration.get()
  const factoryAddress = options.daoFactoryAddress || config.daoFactoryAddress
  const signer = await new Web3Provider(
    options.provider || window.ethereum
  ).getSigner()
  const contract = new Contract(factoryAddress, factoryAbi, signer)
  const result = contract.newGovern(
    args.name,
    args.token,
    args.config,
    args.useProxies
  )

  return result
}
