import { CensusErc20Api } from 'dvote-js'
import { getPool } from './lib/Gateway'
import { ContractReceipt, providers } from 'ethers'

/**
 *
 * @param {providers.JsonRpcSigner} signer
 * @param {string} tokenAddress
 * @returns {Promise<boolean>}
 */
export const isTokenRegistered = async (
  signer: providers.JsonRpcSigner,
  tokenAddress: string
): Promise<boolean> => {
  const pool = await getPool(signer.provider)
  return await CensusErc20Api.isRegistered(tokenAddress, pool)
}

/**
 *
 * @param {providers.JsonRpcSigner} signer
 * @param {string} tokenAddress
 * @returns {Promise<ContractReceipt | string>}
 */
export const registerToken = async (
  signer: providers.JsonRpcSigner,
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
