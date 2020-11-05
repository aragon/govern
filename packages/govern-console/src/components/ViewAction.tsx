import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import Frame from './Frame/Frame'

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

type ViewActionProps = {
  containers: Container[]
}

export default function ViewAction({ containers }: ViewActionProps) {
  const { containerId }: any = useParams()
  const container = useMemo(() => {
    return containers.find(container => container.id === containerId)
  }, [containerId, containers])
  return container ? (
    <>
      <Frame>
        <h2>Action {container.id}</h2>
        <h3>Status</h3>
        <p>{container.state}</p>
      </Frame>

      <Frame>
        <h2>Action Payload</h2>
        <h3>Nonce</h3>
        <p>{container.payload.nonce}</p>
        <h3>Execution time</h3>
        <p>{container.payload.executionTime}</p>
        <h3>Submitter</h3>
        <p>{container.payload.submitter}</p>
        <h3>Proof (Justification)</h3>
        <p>{container.payload.proof}</p>
        <h3>On-chain actions</h3>
        <p>
          <ul
            css={`
              margin-left: 16px;
            `}
          >
            {container.payload.actions.map((action: Action) => (
              <React.Fragment key={action.id}>
                <li>to: {action.to}</li>
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
        <h3>Schedule deposit</h3>
        <p>{container.config.scheduleDeposit.token}</p>
        <p>{container.config.scheduleDeposit.amount}</p>
        <h3>Challenge deposit</h3>
        <p>{container.config.challengeDeposit.token}</p>
        <p>{container.config.challengeDeposit.amount}</p>
        <h3>Resolver</h3>
        <p>{container.config.resolver}</p>
        <h3>Rules</h3>
        <p>{container.config.rules}</p>
      </Frame>
    </>
  ) : (
    <Frame>Container not found.</Frame>
  )
}
