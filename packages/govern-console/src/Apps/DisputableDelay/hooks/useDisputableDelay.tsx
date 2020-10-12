import { useState, useEffect, useCallback } from 'react'
import BN from 'bn.js'
import { utils as EthersUtils } from 'ethers'
import { App } from '@aragon/connect-react'
import connectDisputableDelay from '@1hive/connect-disputable-delay'

import { getExecutionTimeFromUnix } from '../../../lib/date-utils'
import { useContractWithKnownAbi } from '../../../lib/web3-contracts'
import { useWallet } from 'use-wallet'

const ONE_MILLION = new BN('1000000000000000000000000')

function getAppAddress(appName: string, apps: App[]) {
  return apps!.find(app => app!.name!.includes(appName))?.address
}

export function useDisputableDelay(disputableDelayApp: any) {
  const [disputableDelay, setDisputableDelay] = useState<Partial<App | null>>(
    null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!disputableDelayApp) {
      return
    }

    let cancelled = false

    async function getDisputableDelay() {
      const disputableDelay: any = await connectDisputableDelay(
        disputableDelayApp,
        [
          'thegraph',
          {
            subgraphUrl:
              'https://api.thegraph.com/subgraphs/name/1hive/aragon-disputable-delay-rinkeby',
          },
        ],
      )

      if (!cancelled) {
        setDisputableDelay(disputableDelay)
        setLoading(false)
      }
    }

    getDisputableDelay()

    return () => {
      cancelled = true
    }
  }, [disputableDelayApp])

  return [disputableDelay, loading]
}

export function useCollateralRequirements(disputableDelay: any) {
  const [collateral, setCollateral] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!disputableDelay) {
      return
    }
    let cancelled = false

    async function getCollateralRequirement() {
      const collateralRequirement = await disputableDelay.currentCollateralRequirement()
      if (!cancelled) {
        setCollateral(collateralRequirement)
        setLoading(false)
      }
    }
    getCollateralRequirement()

    return () => {
      cancelled = true
    }
  }, [disputableDelay])

  return [collateral, loading]
}

export function useDelayedScripts(disputableDelay: any, apps: App[]) {
  const [delayedScripts, setDelayedScripts] = useState(null)
  const [delayedScriptsLoading, setDelayedScriptsLoading] = useState(true)

  useEffect(() => {
    if (!disputableDelay) {
      return
    }

    let cancelled = false

    async function getDelayedScripts() {
      const delayedScripts = await disputableDelay.delayedScripts()

      const processedScripts = delayedScripts.map((script: any) => {
        const executionDate = getExecutionTimeFromUnix(script.executionFromTime)

        return {
          ...script,
          executionStatus: executionDate,
        }
      })

      if (!cancelled) {
        setDelayedScripts(processedScripts)
        setDelayedScriptsLoading(false)
      }
    }

    getDelayedScripts()

    return () => {
      cancelled = true
    }
  }, [disputableDelay, apps])

  return [delayedScripts, delayedScriptsLoading]
}

export function useChallengeAction(apps: App[], feeToken: string) {
  const { account } = useWallet()
  const agreementAddress = getAppAddress('agreement', apps)
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)
  const tokenContract = useContractWithKnownAbi('TOKEN', feeToken)

  return useCallback(
    async (actionId, settlementOffer, evidence) => {
      if (!agreement || !feeToken || !tokenContract) {
        return
      }
      try {
        const canChallenge = await agreement.canChallenge(actionId)
        if (!canChallenge) {
          return 'CANNOT_CHALLENGE'
        }
        const allowance = await tokenContract.allowance(
          account,
          agreementAddress,
        )
        if (allowance.eq('0')) {
          await tokenContract.approve(agreementAddress, ONE_MILLION)
        }
        const bytesEvidence = EthersUtils.toUtf8Bytes(evidence)
        const hexEvidence = EthersUtils.hexlify(bytesEvidence)
        await agreement.challengeAction(
          actionId,
          settlementOffer,
          false,
          hexEvidence,
          {
            gasLimit: 1000000,
          },
        )
        return 'OK_CHALLENGE'
      } catch (e) {
        console.error(e)
        return 'ERROR_CHALLENGE'
      }
    },
    [account, agreement, agreementAddress, feeToken, tokenContract],
  )
}

export function useDisputeAction(apps: App[], feeToken: string) {
  const { account } = useWallet()
  const agreementAddress = getAppAddress('agreement', apps)
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)
  const tokenContract = useContractWithKnownAbi('TOKEN', feeToken)

  return useCallback(
    async actionId => {
      if (!agreement || !feeToken || !tokenContract) {
        return
      }
      try {
        const canDispute = await agreement.canDispute(actionId)
        if (!canDispute) {
          return 'CANNOT_DISPUTE'
        }
        const allowance = await tokenContract.allowance(
          account,
          agreementAddress,
        )
        if (allowance.eq('0')) {
          await tokenContract.approve(agreementAddress, ONE_MILLION)
        }
        await agreement.disputeAction(actionId, false, {
          gasLimit: 1000000,
        })
        return 'OK_DISPUTE'
      } catch (e) {
        console.error(e)
        return 'ERROR_DISPUTE'
      }
    },
    [account, agreement, agreementAddress, feeToken, tokenContract],
  )
}

export function useExecuteScript(apps: App[]) {
  const disputableDelayAddress = getAppAddress('disputable-delay', apps)
  const disputableDelay = useContractWithKnownAbi(
    'DISPUTABLE_DELAY',
    disputableDelayAddress,
  )

  return useCallback(
    async id => {
      if (!disputableDelay) {
        return
      }
      try {
        const canExecute = await disputableDelay.canExecute(id)
        if (!canExecute) {
          return 'CANNOT_EXECUTE'
        }
        await disputableDelay.execute(id)
        return 'OK_EXECUTE'
      } catch (e) {
        console.error(e)
        return 'ERROR_DISPUTE'
      }
    },
    [disputableDelay],
  )
}

export function useSettleAction(apps: App[], feeToken: string) {
  const agreementAddress = getAppAddress('agreement', apps)
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)

  return useCallback(
    async actionId => {
      if (!agreement || !feeToken) {
        return
      }
      try {
        const canSettle = await agreement.canSettle(actionId)
        if (!canSettle) {
          return 'CANNOT_SETTLE'
        }
        await agreement.settleAction(actionId)
        return 'OK_SETTLE'
      } catch (e) {
        console.error(e)
        return 'ERROR_SETTLE'
      }
    },
    [agreement, feeToken],
  )
}
