import { Contract, utils, providers, BigNumberish, constants } from 'ethers'
import Configuration from '../internal/configuration/Configuration'

export const ContainerConfig = `
  tuple(
    uint256 executionDelay, 
    tuple(
      address token, 
      uint256 amount
    ) scheduleDeposit, 
    tuple(
      address token, 
      uint256 amount
    ) challengeDeposit, 
    address resolver, 
    bytes rules, 
    uint256 maxCalldataSize
  )`

const factoryAbi = [
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
          {
            internalType: 'address',
            name: 'mintAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'mintAmount',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'merkleRoot',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'merkleMintAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct TokenLib.TokenConfig',
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
        internalType: 'address[]',
        name: '_scheduleAccessList',
        type: 'address[]',
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

const registryAbi = [
  'event Registered(address indexed executor, address queue, address indexed token, address indexed registrant, string name)',
]

const tokenAbi = ['function balanceOf(address who) view returns (uint256)']

declare let window: any

export type Token = {
  tokenAddress: string
  tokenDecimals: number
  tokenName: string
  tokenSymbol: string
  mintAddress: string
  mintAmount: BigNumberish | string
  merkleRoot: utils.BytesLike
  merkleMintAmount: BigNumberish | string
}

export type TokenDeposit = {
  token: string
  amount: BigNumberish | string
}

export type DaoConfig = {
  executionDelay: number | string
  scheduleDeposit: TokenDeposit
  challengeDeposit: TokenDeposit
  resolver: string
  rules: utils.BytesLike
  maxCalldataSize: number
}

export type CreateDaoParams = {
  name: string
  token: Partial<Token>
  config: DaoConfig
  scheduleAccessList: string[]
  useProxies?: boolean
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
 * @param {(tokenAddress: string) => void} registeredDaoTokenCallback
 *
 * @returns {Promise<TransactionResponse>} transaction response object
 */
export async function createDao(
  args: CreateDaoParams,
  options: CreateDaoOptions = {},
  registeredDaoTokenCallback?: (tokenAddress: string) => void
): Promise<providers.TransactionResponse> {
  let token: Partial<Token>
  if (!args.token.tokenAddress) {
    const tokenIsMissingInfo =
      !args.token.tokenName ||
      !args.token.tokenSymbol ||
      !args.token.tokenDecimals ||
      !args.token.mintAddress ||
      !args.token.merkleRoot

    if (tokenIsMissingInfo) {
      throw new Error(
        'Missing token name, decimals, symbol, mintAddress, mintAmount and/or merkleRoot'
      )
    }
    token = {
      tokenAddress: constants.AddressZero,
      ...args.token,
    }
  } else {
    token = {
      tokenAddress: args.token.tokenAddress,
      tokenDecimals: 18,
      tokenName: '',
      tokenSymbol: '',
    }
  }

  const config = Configuration.get()
  const factoryAddress = options.daoFactoryAddress || config.daoFactoryAddress
  const signer = await new providers.Web3Provider(
    options.provider || window.ethereum
  ).getSigner()

  const contract = new Contract(factoryAddress, factoryAbi, signer)
  const GovernRegistry = new Contract(
    config.governRegistry,
    registryAbi,
    signer
  )

  if (typeof registeredDaoTokenCallback === 'function') {
    GovernRegistry.on(
      'Registered',
      async (govern, queue, token, registrant, name) => {
        // not our DAO, wait for next one
        if (name !== args.name) return

        // send back token address
        registeredDaoTokenCallback(token)
      }
    )
  }

  const result = contract.newGovern(
    args.name,
    token,
    args.config,
    args.scheduleAccessList,
    args.useProxies
  )

  return result
}
