import { useCallback } from 'react'
import {
  ContractTransaction,
  Contract as EthersContract,
  getDefaultProvider,
  providers,
  utils as EthersUtils,
} from 'ethers'
import { useChainId } from './chain-id'
import { useWalletAugmented } from '../Providers/Wallet'
import { getNetworkEthersName } from './web3-utils'

export function useContract(
  address: string,
  abi: any[],
  signer = true,
): EthersContract | null {
  const { wallet } = useWalletAugmented()
  const { chainId } = useChainId()

  const ethersProvider = wallet.ethereum
    ? new providers.Web3Provider(wallet.ethereum)
    : getDefaultProvider(getNetworkEthersName(chainId))

  const ethersSignerProvider =
    signer &&
    wallet.ethereum &&
    ethersProvider instanceof providers.Web3Provider
      ? ethersProvider.getSigner()
      : null

  return address && EthersUtils.isAddress(address) && ethersProvider && abi
    ? new EthersContract(address, abi, ethersSignerProvider || ethersProvider)
    : null
}

export function useApprove(
  tokenContract: EthersContract | null,
): (amount: string | BigInt, spender: string) => Promise<ContractTransaction> {
  const {
    wallet: { account },
  } = useWalletAugmented()

  return useCallback(
    async (amount: string | BigInt, spender: string) => {
      if (!account) {
        throw new Error('Approving tokens requires a signer.')
      }

      if (!tokenContract) {
        throw new Error('No token contract available.')
      }
      console.log(tokenContract, amount, spender, account)
      // There are 3 cases to check
      // 1. The user has more allowance than needed, we can skip. (0 tx)
      // 2. The user has less allowance than needed, and we need to raise it. (2 tx)
      // 3. The user has 0 allowance, we just need to approve the needed amount. (1 tx)
      const allowance = await tokenContract.allowance(account, spender)
      if (allowance.lt(amount)) {
        if (!allowance.isZero()) {
          const resetTx = await tokenContract.approve(account, '0')
          await resetTx.wait(1)
        }
        return tokenContract.approve(spender, amount)
      }
    },
    [account, tokenContract],
  )
}
