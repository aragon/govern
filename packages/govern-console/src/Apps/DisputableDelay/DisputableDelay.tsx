import React, { useCallback, useState } from 'react'
import { App, Organization } from '@aragon/connect-react'
import 'styled-components/macro'
import {
  useChallengeAction,
  useDelayedScripts,
  useDisputeAction,
  useDisputableDelay,
  useExecuteScript,
  useSettleAction,
  useCollateralRequirements,
} from './hooks/useDisputableDelay'

type DisputableDelayProps = {
  appData: App
  apps: App[]
  org: Organization
}

export default function DisputableDelay({
  appData: disputableDelayApp,
  apps,
}: DisputableDelayProps) {
  const [disputableDelay, disputableDelayLoading]: any = useDisputableDelay(
    disputableDelayApp,
  )
  const [delayedScripts, delayedScriptsLoading]: any = useDelayedScripts(
    disputableDelay,
    apps,
  )
  const [collateral, collateralLoading]: any = useCollateralRequirements(
    disputableDelay,
  )
  const challenge = useChallengeAction(apps, collateral?.tokenId)
  const dispute = useDisputeAction(apps, collateral?.tokenId)
  const execute = useExecuteScript(apps)
  const settle = useSettleAction(apps, collateral?.tokenId)

  const appLoading =
    disputableDelayLoading || delayedScriptsLoading || collateralLoading

  return (
    <div>
      <h2>Delayed Scripts</h2>
      {!appLoading &&
        delayedScripts.map(
          ({
            actionId,
            challengeEndDate,
            challengeId,
            challenger,
            context,
            delayedScriptId,
            delayedScriptStatus,
            disputableDelayId,
            disputeId,
            evmScript,
            executedAt,
            executionStatus,
            pausedAt,
            settledAt,
            submitter,
          }: any) => (
            <div
              key={actionId}
              css={`
                border: 1px solid whitesmoke;
                padding: 8px;
              `}
            >
              <dl>
                <dt>Action Id</dt>
                <dd>{actionId}</dd>
                <dt>Delayed Script ID</dt>
                <dd>{delayedScriptId}</dd>
                <dt>Challenger address</dt>
                <dd>{challenger}</dd>
                <dt>Context</dt>
                <dd>{context}</dd>
                <dt>Delayed Script Status</dt>
                <dd>{delayedScriptStatus}</dd>
                <dt>evmScript</dt>
                <dd
                  css={`
                    word-wrap: break-word;
                  `}
                >
                  {evmScript}
                </dd>
                <dt>Time left for execution</dt>
                <dd>{executionStatus}</dd>
                <dt>Submitter</dt>
                <dd>{submitter}</dd>
              </dl>
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                `}
              >
                <h2>Actions</h2>
                <div
                  css={`
                    max-width: 800px;
                  `}
                >
                  <ChallengeSection actionId={actionId} onClick={challenge} />
                  <DisputeSection actionId={actionId} onClick={dispute} />
                  <SettleSection actionId={actionId} onClick={settle} />
                  <ExecuteSection
                    delayedScriptId={delayedScriptId}
                    onClick={execute}
                  />
                </div>
              </div>
            </div>
          ),
        )}
    </div>
  )
}

type ExecuteSectionProps = {
  delayedScriptId: string
  onClick: Function
}

function ExecuteSection({ delayedScriptId, onClick }: ExecuteSectionProps) {
  const [loading, setLoading] = useState<boolean>(false)

  const handleExecute = useCallback(async () => {
    setLoading(true)
    try {
      await onClick(delayedScriptId)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [delayedScriptId, onClick])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Execute </h3>
      <Button onClick={handleExecute} disabled={loading}>
        Execute
      </Button>
    </div>
  )
}

type ChallengeSectionProps = {
  actionId: string
  onClick: Function
}

function ChallengeSection({ actionId, onClick }: ChallengeSectionProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [offer, setOffer] = useState<string>('')
  const [evidence, setEvidence] = useState<string>('')

  const handleChallenge = useCallback(async () => {
    setLoading(true)
    try {
      await onClick(actionId, offer, evidence)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [actionId, evidence, offer, onClick])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Challenge </h3>
      <label>
        Settlement offer (in Wei)
        <input
          type="input"
          placeholder="1000000000000000000..."
          value={offer}
          onChange={e => setOffer(e.target.value)}
          css={`
            color: black;
          `}
        />
      </label>
      <label>
        Evidence (plain text or IPFS CID)
        <input
          type="input"
          placeholder="IPFS CID"
          value={evidence}
          onChange={e => setEvidence(e.target.value)}
          css={`
            color: black;
          `}
        />
      </label>
      <Button onClick={handleChallenge} disabled={loading}>
        Challenge
      </Button>
    </div>
  )
}

type DisputeProps = {
  actionId: string
  onClick: Function
}

function DisputeSection({ actionId, onClick }: DisputeProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const handleDispute = useCallback(async () => {
    setLoading(true)
    try {
      await onClick(actionId)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [actionId, onClick])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Dispute </h3>
      <Button onClick={handleDispute} disabled={loading}>
        Dispute
      </Button>
    </div>
  )
}

type SettleProps = {
  actionId: string
  onClick: Function
}

function SettleSection({ actionId, onClick }: SettleProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const handleSettle = useCallback(async () => {
    setLoading(true)
    try {
      await onClick(actionId)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [actionId, onClick])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Settle </h3>
      <Button onClick={handleSettle} disabled={loading}>
        Settle
      </Button>
    </div>
  )
}

type ButtonProps = {
  children: React.ReactNode
  disabled: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

function Button({ children, disabled, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      css={`
        position: relative;
        margin-top: 8px;
        font-family: 'Overpass Mono', monospace;
        font-size: 16px;
        background: transparent;
        color: white;
        cursor: pointer;
        border: 1px solid whitesmoke;
        text-decoration: underline;
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        &:active {
          top: 1px;
        }
        &:not(:last-child) {
          margin-right: 8px;
        }
      `}
    >
      {children}
    </button>
  )
}
