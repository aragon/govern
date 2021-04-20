import { Contract } from '@ethersproject/contracts'
import { Web3Provider, TransactionResponse } from '@ethersproject/providers'
import Configuration from '../internal/configuration/Configuration'

const tokenFactoryAbi = [
  `function newToken(
    IERC3000Executor _governExecutor,
    string calldata _tokenName,
    string calldata _tokenSymbol,
    uint8 _tokenDecimals,
    address _mintAddr,
    uint256 _mintAmount,
    bool _useProxies
  ) external returns (
      GovernToken token,
      GovernMinter minter
  )`
]

export async function newToken(
  governExecutor: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  mintAddr: string,
  mintAmount: number,
  useProxies: boolean,
  provider: Web3Provider,
  daoFactoryAddress: string = ''
): Promise<TransactionResponse> {
  const config = Configuration.get()
  const factoryAddress = daoFactoryAddress || config.daoFactoryAddress
  const contract = new Contract(factoryAddress, tokenFactoryAbi, provider)
  const result = await contract.newToken(
    governExecutor,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    mintAddr,
    mintAmount,
    useProxies
  )

  return result
}