
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/abstract-provider'

// rinkeby address for now
const FACTORY_ADDRESS = '0x1791E1D949c21703f49FC2C9a24570FA72ed62Ae'
const FACTORY_ABI = ["function newGovernWithoutConfig(string,address,string,string,bool)"]

declare let window: any;

export type Token = {
  address?: string,
  symbol?: string,
  name?: string
}

export type CreateDaoParams = {
  name: string,
  token: Token,
  useProxies?: boolean
}

export type CreateDaoOptions = {
  provider?: any,
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
  options: CreateDaoOptions = {}): Promise<TransactionResponse>
{
  let { address } = args.token

  if (!args.token.address)
  {
    address = AddressZero
  }

  if (address === AddressZero && (!args.token.name || !args.token.symbol))
  {
    throw new Error('Missing token name and/or symbol')
  }

  const factoryAddress = options.daoFactoryAddress || FACTORY_ADDRESS
  const signer = await new Web3Provider(options.provider || window.ethereum).getSigner()
  const contract = new Contract(factoryAddress, FACTORY_ABI, signer)
  const result = contract.newGovernWithoutConfig(
    args.name,
    address,
    args.token.name || '',
    args.token.symbol || '',
    args.useProxies
  )

  return result
}

