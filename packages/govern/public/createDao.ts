import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import Configuration from '../internal/configuration/Configuration'

const FACTORY_ABI = [
  // 'function newGovern(string _name,(address tokenAddress,uint8 tokenDecimals,string tokenName,string tokenSymbol),(uint256 executionDelay,(address token,uint256 amount),(address token,uint256 amount),address resolver,bytes rules,uint256 maxCalldataSize),bool _useProxies)',
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'tokenDecimals',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'tokenName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'tokenSymbol',
            type: 'string',
          },
        ],
        internalType: 'struct GovernBaseFactory.Token',
        name: '_token',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'executionDelay',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            internalType: 'struct ERC3000Data.Collateral',
            name: 'scheduleDeposit',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            internalType: 'struct ERC3000Data.Collateral',
            name: 'challengeDeposit',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'resolver',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'rules',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'maxCalldataSize',
            type: 'uint256',
          },
        ],
        internalType: 'struct ERC3000Data.Config',
        name: '_config',
        type: 'tuple',
      },
      {
        internalType: 'bool',
        name: '_useProxies',
        type: 'bool',
      },
    ],
    name: 'newGovern',
    outputs: [
      {
        internalType: 'contract Govern',
        name: 'govern',
        type: 'address',
      },
      {
        internalType: 'contract GovernQueue',
        name: 'queue',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

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
  const contract = new Contract(factoryAddress, FACTORY_ABI, signer)
  console.log(args.name, args.token, args.config, args.useProxies)
  const result = contract.newGovern(
    args.name,
    args.token,
    args.config,
    args.useProxies
  )

  return result
}
