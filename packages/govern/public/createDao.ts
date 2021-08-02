import { Contract, utils, providers, Signer, BigNumberish, constants } from 'ethers'
import Configuration from '../internal/configuration/Configuration'
import { setUpRegisteredEvent } from '../utils/events'

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
    bytes32 merkleRoot,
    uint256 merkleMintAmount,
    bytes merkleTree,
    bytes merkleContext
  )`

const factoryAbi = [
  `function newGovern(
    ${token} _token, 
    address[] _scheduleAccessList,
    bool _useProxies,
    ${ContainerConfig} _config, 
    string _name
  ) external`,
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
  merkleTree: utils.BytesLike
  merkleContext: utils.BytesLike
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
  governRegistry?: string
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
  registeredDaoCallback?: (tokenAddress: string, executor: string) => void
): Promise<providers.TransactionResponse> {
  let token: Partial<Token>
  
  let isTrue = true

  const keys: (keyof Partial<Token>)[] = [
    'tokenName',
    'tokenSymbol',
    'tokenDecimals',
    'mintAddress',
    'merkleRoot',
    'merkleMintAmount',
    'merkleTree',
    'merkleContext',
  ]

  if (!args.token.tokenAddress) {
    const tokenIsMissingInfo = keys.every((item) =>
      args.token.hasOwnProperty(item)
    )
    if (!tokenIsMissingInfo) {
      throw new Error(`Missing ${keys.join(' or ')}`)
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
      mintAddress: constants.AddressZero,
      mintAmount: 0,
      merkleRoot: '0x' + '00'.repeat(32),
      merkleMintAmount: 0,
      merkleTree: '0x',
      merkleContext: '0x',
    }
  }

  const config = Configuration.get()
  const factoryAddress = options.daoFactoryAddress || config.daoFactoryAddress
  const signer = await new providers.Web3Provider(
    options.provider || window.ethereum
  ).getSigner()

  const contract = new Contract(factoryAddress, factoryAbi, signer)
  
  setUpRegisteredEvent(
    options.governRegistry || config.governRegistry,
    signer, 
    registeredDaoCallback, 
    args.name
  );
 
  const result = contract.newGovern(
    token,
    args.scheduleAccessList,
    args.useProxies,
    args.config,
    args.name
  )

  return result
}
