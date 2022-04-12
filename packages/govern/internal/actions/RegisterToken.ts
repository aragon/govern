import { CensusErc20Api } from '@vocdoni/census'
import { getPool } from './lib/Gateway'
import { ContractReceipt, Wallet, Signer } from 'ethers'

/**
 *
 * @param {Wallet | Signer} signer
 * @param {string} tokenAddress
 * @returns {Promise<boolean>}
 */
export const isTokenRegistered = async (
  signer: Wallet | Signer,
  tokenAddress: string
): Promise<boolean> => {
  const pool = await getPool(signer.provider)
  return await CensusErc20Api.getTokenInfo(tokenAddress, pool)
    .then(tokenInfo => tokenInfo.isRegistered)
}

/**
 *
 * @param {Wallet | Signer} signer
 * @param {string} tokenAddress
 * @returns {Promise<ContractReceipt | string>}
 */
export const registerToken = async (
  signer: Wallet | Signer,
  tokenAddress: string
): Promise<ContractReceipt | string> => {
  const pool = await getPool(signer.provider)
  const isRegistered = await isTokenRegistered(signer, tokenAddress)
  if (isRegistered) {
    // already registered,
    // we return the string ALREADY_REGISTERED instead of undefined
    return 'ALREADY_REGISTERED'
  }

  const result = CensusErc20Api.registerTokenAuto(tokenAddress, signer, pool)

  return result
}
