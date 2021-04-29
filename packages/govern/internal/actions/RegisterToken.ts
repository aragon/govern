import { CensusErc20Api, GatewayPool } from 'dvote-js'
import { getPool } from './lib/Gateway'
import {
  BigNumber,
  ContractReceipt,
  Contract,
  providers
} from 'ethers'

// currently the only way to find token mapping balance position is
// by brute force, generally 20 tries will be enough
const MAX_TRY = 20

export const registerToken = async (
  signer: providers.JsonRpcSigner,
  Token: Contract
): Promise<ContractReceipt | undefined> => {
  const deployer = await signer.getAddress()
  const blockNumber = await signer.provider.getBlockNumber()
  console.log('this is the deployer ', deployer)
  const balance = await Token.balanceOf(deployer)

  // console.log('Balance: ', balance.value.toString())
  console.log('Balance: ', balance)
  console.log('Block number: ', blockNumber)


  let found = false
  let position: number
  console.log("Let's look for the balance mapping slot ")
  for (position = 0; position < MAX_TRY; position++) {
    const balanceSlot = CensusErc20Api.getHolderBalanceSlot(deployer, position)

    try {
      const result = await CensusErc20Api.generateProof(
        Token.address,
        [balanceSlot],
        blockNumber,
        signer.provider as any,
        { verify: true }
      )

      if (result == null || !result.proof) continue
      const onChainBalance = BigNumber.from(result.proof.storageProof[0].value)

      if (!onChainBalance.eq(balance)) {
        console.warn(
          'The proved balance does not match the on-chain balance:',
          result.proof.storageProof[0].value,
          'vs',
          balance.toHexString()
        )
      }

      found = true
      break;
    } catch (e) {
      console.log('This is the error ', e.message)
      console.log('Result not found on index ', position)
    }
  }

  if (found) {
    const pool = await getPool(signer.provider)
    console.log('Registering token...')
    const result = CensusErc20Api.registerToken(
      Token.address,
      position,
      signer,
      pool
    )

    return result
  }
}
