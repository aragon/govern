import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import {
  BigNumber as EthersBigNumber,
  Contract as EthersContract,
  getDefaultProvider,
  providers,
  utils as EthersUtils,
} from 'ethers'
import { useWallet } from '../Providers/Wallet'
import { getKnownContract } from './known-contracts'
import { useChainId } from '../Providers/ChainId'
import { bigNum, getNetworkNode, getNetworkEthersName } from './web3-utils'

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

export function useKnownContract(
  name: string,
  signer = true,
): EthersContract | null {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

export function useContractWithKnownAbi(
  name: string,
  address: string,
): EthersContract | null {
  const [, abi] = getKnownContract(name)
  return useContract(address, abi, true)
}

export function useContractReadOnly(
  name: string,
  address: string,
): EthersContract | null {
  const ethEndpoint = getNetworkNode()
  const [, abi] = getKnownContract(name)

  return useMemo(() => {
    if (!address) {
      return null
    }
    return new EthersContract(
      address,
      abi,
      ethEndpoint ? new providers.JsonRpcProvider(ethEndpoint) : undefined,
    )
  }, [abi, address, ethEndpoint])
}

export function useTokenBalance(symbol: string, address = ''): EthersBigNumber {
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)
  const { wallet } = useWallet()
  const { account } = wallet

  const cancelBalanceUpdate = useRef<(() => void) | null>(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current?.()
      cancelBalanceUpdate.current = null
    }

    if ((!account && !address) || !tokenContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }
    const requestedAddress = address || account
    tokenContract
      .balanceOf(requestedAddress)
      .then((balance: EthersBigNumber) => {
        if (!cancelled) {
          setBalance(balance)
        }
      })
      .catch((err: Error) => err)
  }, [account, address, tokenContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if ((!account && !address) || !tokenContract) {
      return
    }

    const onTransfer = (from: string, to: string) => {
      if (
        from === account ||
        to === account ||
        from === address ||
        to === address
      ) {
        updateBalance()
      }
    }
    tokenContract.on('Transfer', onTransfer)

    return () => {
      tokenContract.removeListener('Transfer', onTransfer)
    }
  }, [account, address, tokenContract, updateBalance])

  return balance
}
