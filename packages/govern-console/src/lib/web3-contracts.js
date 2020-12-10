import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import {
  Contract as EthersContract,
  providers,
  utils as EthersUtils,
  getDefaultProvider,
} from 'ethers'
import { useWallet } from 'use-wallet'
import { getKnownContract } from './known-contracts'
import { useChainId } from '../Providers/ChainId'
import { bigNum, getNetworkNode } from './web3-utils'

export function useContract(
  address: string,
  abi: any[],
  signer = true,
): EthersContract {
  const { ethereum } = useWallet()
  const { chainId } = useChainId()

  let ethersProvider
  if (!ethereum) {
    ethersProvider = getDefaultProvider(chainId)
  } else {
    ethersProvider = new providers.Web3Provider(ethereum)
  }

  if (!address || !EthersUtils.isAddress(address) || !ethersProvider || !abi) {
    return null
  }

  const contract = new EthersContract(
    address,
    abi,
    signer && ethereum ? ethersProvider.getSigner() : ethersProvider,
  )

  return contract
}

export function useKnownContract(name: string, signer = true): EthersContract {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

export function useContractWithKnownAbi(
  name: string,
  address: string,
): EthersContract {
  const [, abi] = getKnownContract(name)
  return useContract(address, abi, true)
}

export function useContractReadOnly(
  name: string,
  address: string,
): EthersContract | null {
  const ethEndpoint = getNetworkNode()
  const [, abi] = getKnownContract(name)

  const ethProvider = useMemo(
    () => (ethEndpoint ? new providers.JsonRpcProvider(ethEndpoint) : null),
    [ethEndpoint],
  )

  return useMemo(
    () => (address ? new EthersContract(address, abi, ethProvider) : null),
    [abi, address, ethProvider],
  )
}

export function useTokenBalance(
  symbol: string,
  address = '',
): EthersUtils.BigNumber {
  const { account } = useWallet()
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
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
      .then(balance => {
        if (!cancelled) {
          setBalance(balance)
        }
      })
      .catch(err => err)
  }, [account, address, tokenContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if ((!account && !address) || !tokenContract) {
      return
    }

    const onTransfer = (from, to) => {
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
