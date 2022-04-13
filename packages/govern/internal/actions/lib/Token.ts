import { BigNumber } from "@ethersproject/bignumber"
import { ContractReceipt } from "@ethersproject/contracts"
import { Signer } from "@ethersproject/abstract-signer"
import { Wallet } from "@ethersproject/wallet"
import { GatewayPool } from '@vocdoni/client'
import { ERC20Proof } from "@vocdoni/storage-proofs-eth"

export namespace CensusErc20Api {
  /** Finds the balance mapping position of the given ERC20 token address and attempts to register it on the blockchain */
  export async function registerTokenAuto(tokenAddress: string, walletOrSigner: Wallet | Signer, gw: GatewayPool, customContractAddress?: string): Promise<ContractReceipt> {
    const contractInstance = await gw.getTokenStorageProofInstance(walletOrSigner, customContractAddress)

    const mapSlot = await CensusErc20Api.findBalanceMappingPosition(tokenAddress, await walletOrSigner.getAddress(), gw.provider)
    if (mapSlot === null) throw new Error("The given token contract does not seem to have a defined mapping position for the holder balances")

    const tx = await contractInstance.registerToken(tokenAddress, mapSlot)
    // @ts-ignore
    return tx.wait()
  }

  /** Associates the given balance mapping position to the given ERC20 token address  */
  export function registerToken(tokenAddress: string, balanceMappingPosition: number | BigNumber, walletOrSigner: Wallet | Signer, gw: GatewayPool, customContractAddress?: string) {
    return gw.getTokenStorageProofInstance(walletOrSigner, customContractAddress)
      .then((contractInstance) =>
        contractInstance.registerToken(tokenAddress,
          balanceMappingPosition
        )
      )
      .then(tx => tx.wait())
  }

  export function getTokenInfo(tokenAddress: string, gw: GatewayPool, customContractAddress?: string): Promise<{ isRegistered: boolean, isVerified: boolean, balanceMappingPosition: number }> {
    return gw.getTokenStorageProofInstance(null, customContractAddress)
      .then((contractInstance) => contractInstance.tokens(tokenAddress))
      .then((tokenDataTuple) => {
        const balanceMappingPosition = BigNumber.isBigNumber(tokenDataTuple[2]) ?
          tokenDataTuple[2].toNumber() : tokenDataTuple[2]

        return {
          isRegistered: tokenDataTuple[0],
          isVerified: tokenDataTuple[1],
          balanceMappingPosition
        }
      })
  }

  // Helpers

  /**
   * Attempts to find the index at which the holder balances are stored within the token contract.
   * If the position cannot be found among the 50 first ones, `null` is returned.
   */
  export function findBalanceMappingPosition(tokenAddress: string, holderAddress: string, provider) {
    return ERC20Proof.findMapSlot(tokenAddress, holderAddress, provider)
  }
}

