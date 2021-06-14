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

const token = `
  tuple(
    address tokenAddress, 
    uint8 tokenDecimals, 
    string tokenName, 
    string tokenSymbol,
    address mintAddress,
    uint256 mintAmount,
    byte32 merkleRoot,
    uint256 merkleMintAmount,
  )`

const factoryAbi = [
  `function newGovern(
    string _name, 
    ${token} _token, 
    ${ContainerConfig} _config,
    address[] _scheduleAccessList,
    bool _useProxies
  )`,
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
      !args.token.mintAmount

    if (tokenIsMissingInfo) {
      throw new Error(
        'Missing token name, decimals, symbol, mintAmount and/or mintAddress'
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
