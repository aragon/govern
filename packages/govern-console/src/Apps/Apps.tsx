import React, { useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { App, Organization } from '@aragon/connect-react'

import 'styled-components/macro'

// Frontends
import Agent from './Agent/Agent'
import Agreement from './Agreement/Agreement'
import DisputableDelay from './DisputableDelay/DisputableDelay'

const KNOWN_APPS = new Map([
  ['agent', Agent],
  ['agreement', Agreement],
  ['agreement-1hive', Agreement],
  ['disputable-delay', DisputableDelay],
])

type AppsProps = {
  apps: App[]
  org: Organization
}

export default function Apps({ apps, org }: AppsProps) {
  const history = useHistory()
  const { appAddress }: any = useParams()

  const matchingApp = apps.find(({ address }) => address === appAddress)
  // TODO: add "no app matched" view
  const matchingView = KNOWN_APPS.get(matchingApp!.name!)

  const MatchingView = useMemo(() => matchingView, [matchingView])
  const title = useMemo(
    () => matchingApp!.name!.replace(/\b\w/g, c => c.toUpperCase()),
    [matchingApp],
  )

  if (!matchingView) {
    return <h2>Generic View</h2>
  }

  return (
    <>
      <button
        type="button"
        onClick={() => history.goBack()}
        css={`
          margin-top: 8px;
          font-family: 'Overpass Mono', monospace;
          font-size: 16px;
          position: relative;
          background: transparent;
          color: white;
          cursor: pointer;
          border: 0px;
          text-decoration: underline;
        `}
      >
        Back
      </button>
      <div
        css={`
          padding: 8px;
          margin-top: ${1 * 8}px;
          border: 1px solid whitesmoke;
        `}
      >
        <h2>{title}</h2>
        {/* @ts-ignore */}
        <MatchingView appData={matchingApp} apps={apps} org={org} />
      </div>
    </>
  )
}
