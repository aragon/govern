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

export function useContract(address, abi, signer = true) {
  const { ethereum } = useWallet()
  const { chainId } = useChainId()

  let ethersProvider
  if (!ethereum) {
    ethersProvider = getDefaultProvider(chainId)
  } else {
    ethersProvider = new providers.Web3Provider(ethereum)
  }

  if (!address || !EthersUtils.isAddress(address) || !ethersProvider || !abi) {
    console.log(
      'alo',
      address,
      EthersUtils.isAddress(address),
      ethersProvider,
      ethereum,
    )
    return null
  }

  const contract = new EthersContract(
    address,
    abi,
    signer && ethereum ? ethersProvider.getSigner() : ethersProvider,
  )

  return contract
}

export function useKnownContract(name, signer = true) {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

export function useContractWithKnownAbi(name, address) {
  const [, abi] = getKnownContract(name)
  return useContract(address, abi, true)
}

export function useContractReadOnly(name, address) {
  const ethEndpoint = getNetworkNode()
  const [, abi] = getKnownContract(name)

  const ethProvider = useMemo(
    () => (ethEndpoint ? new providers.JsonRpcProvider(ethEndpoint) : null),
    [ethEndpoint],
  )

  return useMemo(() => {
    if (!address) {
      return null
    }
    return new EthersContract(address, abi, ethProvider)
  }, [abi, address, ethProvider])
}

export function useTokenBalance(symbol, address = '') {
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

    const onTransfer = (from, to, value) => {
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

export function useSignAgreement(agreementAddress) {
  const { account } = useWallet()
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)
  return useCallback(async () => {
    try {
      if (!agreement) {
        return
      }
      const { mustSign } = await agreement.getSigner(account)
      if (mustSign) {
        const currentSettingId = await agreement.getCurrentSettingId()
        const tx = await agreement.sign(currentSettingId)
        await tx.wait()
        return 'success'
      } else {
        return 'already-signed'
      }
    } catch (e) {
      console.error(e)
      return 'error'
    }
  }, [account, agreement])
}

export function useAgreementSettings(agreementAddress) {
  const [settings, setSettings] = useState(null)
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)

  useEffect(() => {
    async function getAgreementSettings() {
      if (!agreement) {
        return
      }
      try {
        const currentSettingId = await agreement.getCurrentSettingId()
        const [
          arbitrator,
          cashier,
          title,
          content,
        ] = await agreement.getSetting(currentSettingId)
        const utfContent = EthersUtils.toUtf8String(content)
        const [, ipfsCid] = utfContent.split(':')
        setSettings({
          arbitrator,
          cashier,
          title,
          content: ipfsCid,
        })
      } catch (e) {
        console.error(e)
      }
    }

    getAgreementSettings()
  }, [agreement])

  return settings
}
