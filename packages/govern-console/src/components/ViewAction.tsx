import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import Frame from './Frame/Frame'

type Collateral = {
  token: String
  amount: String
}

type Config = {
  executionDelay: String
  scheduleDeposit: Collateral
  challengeDeposit: Collateral
  resolver: String
  rules: String
}

type Action = {
  id: String
  to: String
  value: String
  data: String
}

type Payload = {
  id: String
  nonce: String
  executionTime: String
  submitter: String
  executor: any
  actions: [Action]
  proof: String
}

type ContainerEventChallenge = {
  id: String
  container: any
  createdAt: String
  actor: String
  collateral: Collateral
  disputeId: String
  reason: String
  resolver: String
}

type ContainerEventExecute = {
  id: String
  container: any
  createdAt: String
  execResults: [String]
}

type ContainerEventResolve = {
  id: String
  container: any
  createdAt: String
  approved: Boolean
}

type ContainerEventRule = {
  id: String
  container: any
  createdAt: String
  ruling: String
}

type ContainerEventSchedule = {
  id: String
  container: any
  createdAt: String
  collateral: Collateral
}

type ContainerEventSubmitEvidence = {
  id: String
  container: any
  createdAt: String
  evidence: String
  submitter: String
  finished: Boolean
}

type ContainerEventVeto = {
  id: String
  container: any
  created: String
  reason: String
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
  id: String
  queue: String
  state: String
  config: Config
  payload: Payload
  history: [ContainerEvent]
}

type ViewActionProps = {
  containers: [Container]
}

export default function ViewAction({ containers }: ViewActionProps) {
  const { containerId }: any = useParams()
  const container = useMemo(() => {
    return containers.find(container => container.id === containerId)
  }, [])
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
              <>
                <li>to: {action.to}</li>
                <li>value: {action.value}</li>
                <li>data: {action.data}</li>
              </>
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
