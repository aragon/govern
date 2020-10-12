import React from 'react'
import { App, Organization } from '@aragon/connect-react'
import 'styled-components/macro'

type AgentProps = {
  appData: App
  apps: App[]
  org: Organization
}

export default function Agent({ appData: agentApp }: AgentProps) {
  return (
    <div
      css={`
        margin-top: 16px;
      `}
    >
      <h2>EVMScript generator</h2>
    </div>
  )
}
