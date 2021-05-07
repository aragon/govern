import { Contract, providers } from 'ethers'
import { Token } from './createDao'

const tokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
]

export async function getToken(tokenAddress: string, provider: providers.Web3Provider): Promise<Token> {
  const contract = new Contract(tokenAddress, tokenAbi, provider)
  const [tokenDecimals, tokenName, tokenSymbol]: [number, string, string] = await Promise.all([
    contract.decimals(),
    contract.name(),
    contract.symbol()
  ])
  return {
    tokenAddress,
    tokenDecimals, 
    tokenName,
    tokenSymbol 
  }
}
