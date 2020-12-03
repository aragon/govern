import React, { useMemo, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as clipboard from 'clipboard-polyfill'
import { toHex } from 'web3-utils'
import 'styled-components/macro'
import Button from '../Button'
import Entity from '../Entity/Entity'
import Frame from '../Frame/Frame'
import Info from '../Info/Info'
import { useContract } from '../../lib/web3-contracts'
import { shortenAddress, ETH_EMPTY_HEX } from '../../lib/web3-utils'
import queueAbi from '../../lib/abi/GovernQueue.json'
import { usePermissions } from '../../Providers/Permissions'
import { useWallet } from '../../Providers/Wallet'

const EMPTY_FAILURE_MAP =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

type Collateral = {
  token: string
  amount: string
}

type Config = {
  executionDelay: string
  scheduleDeposit: Collateral
  challengeDeposit: Collateral
  resolver: string
  rules: string
}

type Action = {
  id: string
  to: string
  value: string
  data: string
}

type Payload = {
  id: string
  nonce: string
  executionTime: string
  submitter: string
  executor: any
  actions: Action[]
  proof: string
}

type ContainerEventChallenge = {
  id: string
  container: any
  createdAt: string
  actor: string
  collateral: Collateral
  disputeId: string
  reason: string
  resolver: string
}

type ContainerEventExecute = {
  id: string
  container: any
  createdAt: string
  execResults: string[]
}

type ContainerEventResolve = {
  id: string
  container: any
  createdAt: string
  approved: Boolean
}

type ContainerEventRule = {
  id: string
  container: any
  createdAt: string
  ruling: string
}

type ContainerEventSchedule = {
  id: string
  container: any
  createdAt: string
  collateral: Collateral
}

type ContainerEventSubmitEvidence = {
  id: string
  container: any
  createdAt: string
  evidence: string
  submitter: string
  finished: Boolean
}

type ContainerEventVeto = {
  id: string
  container: any
  created: string
  reason: string
}

type ContainerEvent =
  | ContainerEventChallenge
  | ContainerEventExecute
  | ContainerEventResolve
  | ContainerEventRule
  | ContainerEventSchedule
  | ContainerEventSubmitEvidence
  | ContainerEventVeto

type Container = {
  id: string
  queue: string
  state: string
  config: Config
  payload: Payload
  history: ContainerEvent[]
}

type ViewActionWrapperProps = {
  containers: Container[]
  queueAddress: string
}

type ViewActionProps = {
  container: Container
  queueAddress: string
}

function ViewAction({ container, queueAddress }: ViewActionProps) {
  const [executionStatus, setExecutionStatus] = useState('')
  const [justification, setJustification] = useState('')
  const [statusType, setStatusType] = useState<
    'error' | 'info' | 'success' | ''
  >('')
  const { wallet } = useWallet()
  const { status: accountStatus } = wallet
  const queueContract = useContract(queueAddress, queueAbi)
  const { permissions } = usePermissions()
  const {
    execute: canExecute,
    veto: canVeto,
    challenge: canChallenge,
  } = permissions

  const handleSetExecutionStatus = useCallback(
    (result, message) => {
      setStatusType(result)
      setExecutionStatus(message)
    },
    [setExecutionStatus, setStatusType],
  )

  const execute = useCallback(async () => {
    if (accountStatus !== 'connected') {
      alert('Executing actions requires a signer. Please connect your account.')
      return
    }
    const payloadActions = container.payload.actions.map((action: Action) => ({
      to: action.to,
      value: action.value,
      data: action.data,
    }))
    const craftedContainer = {
      payload: {
        nonce: container.payload.nonce,
        executionTime: container.payload.executionTime,
        submitter: container.payload.submitter,
        executor: container.payload.executor.address,
        actions: payloadActions,
        allowFailuresMap: EMPTY_FAILURE_MAP,
        proof: container.payload.proof,
      },
      config: {
        executionDelay: container.config.executionDelay,
        scheduleDeposit: {
          token: container.config.scheduleDeposit.token,
          amount: container.config.scheduleDeposit.amount,
        },
        challengeDeposit: {
          token: container.config.challengeDeposit.token,
          amount: container.config.challengeDeposit.amount,
        },
        resolver: container.config.resolver,
        rules: container.config.rules,
      },
    }

    try {
      const tx = await queueContract!.execute(craftedContainer, {
        gasLimit: 500000,
      })
      handleSetExecutionStatus('info', `Sending transaction.`)
      await tx.wait(1)
      handleSetExecutionStatus(
        'success',
        `Transaction sent successfully. hash: ${tx.hash}`,
      )
    } catch (err) {
      console.log(err)
      handleSetExecutionStatus(
        'error',
        `There was an error with the transaction.`,
      )
    }
  }, [accountStatus, container, handleSetExecutionStatus, queueContract])

  const veto = useCallback(async () => {
    if (accountStatus !== 'connected') {
      alert('Executing actions requires a signer. Please connect your account.')
      return
    }
    try {
      const containerHash = container.id
      const tx = await queueContract!.veto(
        containerHash,
        justification ? toHex(justification) : '0x00',
        {
          gasLimit: 500000,
        },
      )
      handleSetExecutionStatus('info', `Sending transaction.`)
      await tx.wait(1)
      handleSetExecutionStatus(
        'success',
        `Transaction sent successfully. hash: ${tx.hash}`,
      )
    } catch (err) {
      console.log(err)
      handleSetExecutionStatus(
        'error',
        `There was an error with the transaction.`,
      )
    }
  }, [
    accountStatus,
    container,
    handleSetExecutionStatus,
    queueContract,
    justification,
  ])

  const challenge = useCallback(async () => {
    if (accountStatus !== 'connected') {
      alert('Executing actions requires a signer. Please connect your account.')
      return
    }
    const payloadActions = container.payload.actions.map((action: Action) => ({
      to: action.to,
      value: action.value,
      data: action.data,
    }))
    // TODO: handle token approvals first
    const craftedContainer = {
      payload: {
        nonce: container.payload.nonce,
        executionTime: container.payload.executionTime,
        submitter: container.payload.submitter,
        executor: container.payload.executor.address,
        actions: payloadActions,
        allowFailuresMap: EMPTY_FAILURE_MAP,
        proof: container.payload.proof,
      },
      config: {
        executionDelay: container.config.executionDelay,
        scheduleDeposit: {
          token: container.config.scheduleDeposit.token,
          amount: container.config.scheduleDeposit.amount,
        },
        challengeDeposit: {
          token: container.config.challengeDeposit.token,
          amount: container.config.challengeDeposit.amount,
        },
        resolver: container.config.resolver,
        rules: container.config.rules,
      },
    }
    try {
      const tx = await queueContract!.challenge(craftedContainer, '0x00', {
        gasLimit: 500000,
      })
      handleSetExecutionStatus('info', `Sending transaction.`)
      await tx.wait(1)
      handleSetExecutionStatus(
        'success',
        `Transaction sent successfully. hash: ${tx.hash}`,
      )
    } catch (err) {
      console.log(err)
      handleSetExecutionStatus(
        'error',
        `There was an error with the transaction.`,
      )
    }
  }, [accountStatus, container, handleSetExecutionStatus, queueContract])
  console.log(container)

  const vetoEvent = container.history.find(
    (event: any) => event.__typename === 'ContainerEventVeto',
  )
  // @ts-ignore
  const reason = vetoEvent?.reason ?? ''

  return (
    <>
      <Frame>
        <h2>Action {shortenAddress(container.id)}</h2>
        <h3>Status</h3>
        <p>{container.state}</p>
        {container.state === 'Cancelled' && (
          <>
            <h3>Reason </h3>
            <Entity address={reason} type="address" />
          </>
        )}
        {executionStatus && <Info mode={statusType}>{executionStatus}</Info>}
      </Frame>

      {container.state !== 'Executed' && container.state !== 'Cancelled' && (
        <Frame>
          <div>
            <label
              css={`
                display: flex;
                flex-direction: column;
              `}
            >
              Justification (if vetoing or challenging)
              <input
                value={justification}
                onChange={e => setJustification(e.target.value)}
                css={`
                  margin-top: 12px;
                  color: black;
                `}
              />
            </label>
          </div>
          <h2>Available actions</h2>
          {container.state === 'Scheduled' && (
            <Button
              onClick={execute}
              css={`
                margin-right: 16px;
              `}
            >
              Execute
            </Button>
          )}
          {canVeto && (
            <Button
              onClick={veto}
              css={`
                margin-right: 16px;
              `}
            >
              Veto
            </Button>
          )}
          {canChallenge && (
            <Button
              onClick={challenge}
              css={`
                margin-right: 16px;
              `}
            >
              Challenge
            </Button>
          )}
        </Frame>
      )}
      <Frame>
        <h2>Action Payload</h2>
        <h3>Container hash</h3>
        <p onClick={() => clipboard.writeText(container.id)}>{container.id}</p>
        <h3>Nonce</h3>
        <p>{container.payload.nonce}</p>
        <h3>Execution time</h3>
        <p>{container.payload.executionTime}</p>
        <h3>Submitter</h3>
        <p>
          <Entity address={container.payload.submitter} type="address" />
        </p>
        <h3>Proof (Justification)</h3>
        <p>
          <Entity address={container.payload.proof} type="address" shorten />
        </p>
        <h3>On-chain actions</h3>
        <p>
          <ul
            css={`
              margin-left: 16px;
            `}
          >
            {container.payload.actions.map((action: Action) => (
              <React.Fragment key={action.id}>
                <li>
                  to: <Entity address={action.to} type="address" />
                </li>
                <li>value: {action.value}</li>
                <li>data: {action.data}</li>
              </React.Fragment>
            ))}
          </ul>
        </p>
      </Frame>

      <Frame>
        <h2>Action Configuration</h2>
        <h3>Execution Delay</h3>
        <p>{container.config.executionDelay}</p>
        <h3>Schedule collateral</h3>
        <p>
          Token:{' '}
          <Entity
            address={container.config.scheduleDeposit.token}
            type="address"
          />
        </p>
        <p>Amount: {container.config.scheduleDeposit.amount}</p>
        <h3>Challenge collateral</h3>
        <p>
          Token:{' '}
          <Entity
            address={container.config.challengeDeposit.token}
            type="address"
          />{' '}
        </p>
        <p>Amount: {container.config.challengeDeposit.amount}</p>
        <h3>Resolver</h3>
        <p>
          <Entity address={container.config.resolver} type="address" />
        </p>
        <h3>Rules</h3>
        <p>
          {container.config.rules === ETH_EMPTY_HEX ? (
            'No agreement attached.'
          ) : (
            <Entity address={container.config.rules} type="address" />
          )}
        </p>
      </Frame>
    </>
  )
}

export default function ViewActionWrapper({
  containers,
  queueAddress,
}: ViewActionWrapperProps) {
  const { containerId }: any = useParams()
  const container = useMemo(() => {
    return containers.find(container => container.id === containerId)
  }, [containerId, containers])

  if (!container) {
    return <Frame>Container not found.</Frame>
  }

  return <ViewAction container={container} queueAddress={queueAddress} />
}
