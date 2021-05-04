import { CensusErc20Api } from 'dvote-js'
import { getPool } from './lib/Gateway'
import {
  ContractReceipt,
  Contract,
  providers
} from 'ethers'

export const registerToken = async (
  signer: providers.JsonRpcSigner,
  Token: Contract
): Promise<ContractReceipt | undefined> => {

  const pool = await getPool(signer.provider)
  const isRegistered = await CensusErc20Api.isRegistered(Token.address, pool)
  if( isRegistered ) {
    // already registered, quick return
    return
  }

  // verified position will be set later when providing proof using
  // - CensusErc20Api.setBalanceMappingPosition to set position
  // - CensusErc20Api.setVerifiedBalanceMappingPosition to provide proof
  // registerToken does not require valid position or proof to be provided
  const position = 2
  const result = CensusErc20Api.registerToken(
    Token.address,
    position,
    signer,
    pool
  )

  return result
}
