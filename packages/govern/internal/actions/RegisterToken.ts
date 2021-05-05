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
  
  const result = CensusErc20Api.registerTokenAuto(
    Token.address,
    signer,
    pool
  )

  return result
}
