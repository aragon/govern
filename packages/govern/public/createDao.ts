import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import Configuration from '../internal/configuration/Configuration'
// @TODO: Change this
import * as registryAbi from '../tests/hardhat/registryAbi.json'
import { registerToken } from '../internal/actions/RegisterToken'

const FACTORY_ABI = [
  'function newGovernWithoutConfig(string,address,string,string,bool)',
]

declare let window: any

export type Token = {
  address?: string
  symbol?: string
  name?: string
}

export type CreateDaoParams = {
  name: string
  token: Token
  useProxies?: boolean
  useVocdoni?: boolean
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
  let { address } = args.token

  if (!args.token.address) {
    address = AddressZero
  }

  if (address === AddressZero && (!args.token.name || !args.token.symbol)) {
    throw new Error('Missing token name and/or symbol')
  }

  const config = Configuration.get()
  const signer = await new Web3Provider(
    options.provider || window.ethereum
  ).getSigner()

  console.log(await signer.getAddress())
  console.log(address)

  if (args.useVocdoni) {
    const GovernRegistry = new Contract(
      config.governRegistry,
      registryAbi,
      signer
    )
    const registerEvent = GovernRegistry.filters.Registered()
    GovernRegistry.on(registerEvent, async (queue, govern, token) => {
      if (token) {
        await new Promise((resolve) => {
          setTimeout(resolve, 15000)
        })
    
        const ERC20 = new Contract(
          token,
          ['function balanceOf(address)'],
          signer
        )
        console.log(ERC20.address)
        console.log("There's token! Let's try to register")
        await registerToken(signer, ERC20)
      }
    })
  }

  const factoryAddress = options.daoFactoryAddress || config.daoFactoryAddress
  const contract = new Contract(factoryAddress, FACTORY_ABI, signer)
  const result = await contract.newGovernWithoutConfig(
    args.name,
    address,
    args.token.name || '',
    args.token.symbol || '',
    args.useProxies
  )

  return result
}
