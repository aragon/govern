import {
  Contract as EthersContract,
  getDefaultProvider,
  providers,
  utils as EthersUtils,
} from 'ethers'
import { useChainId } from './chain-id'
import { useWallet } from '../Providers/Wallet'
import { getNetworkEthersName } from './web3-utils'

export function useContract(
  address: string,
  abi: any[],
  signer = true,
): EthersContract | null {
  const { wallet } = useWallet()
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
