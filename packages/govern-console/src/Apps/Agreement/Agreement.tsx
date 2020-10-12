import React, { useState } from 'react'
import { useWallet } from 'use-wallet'
import { App, Organization } from '@aragon/connect-react'
import 'styled-components/macro'
import {
  useAgreementSettings,
  useSignAgreement,
} from '../../lib/web3-contracts.js'

function getInfoMode(signStatus: string) {
  if (signStatus === 'error') {
    return 'error'
  }

  return 'info'
}

function getInfoText(signStatus: string) {
  if (signStatus === 'error') {
    return 'There was an error while signing the agreement.'
  }

  if (signStatus === 'already-signed') {
    return 'You have already signed this agreement.'
  }

  return 'Agreement signed successfuly.'
}

type AgreementProps = {
  appData: App
  apps: App[]
  org: Organization
}

export default function Agreement({ appData: agreement }: AgreementProps) {
  const { account } = useWallet()
  const [signState, setSignState] = useState('')
  const signAgreement = useSignAgreement(agreement.address)
  const settings: any = useAgreementSettings(agreement.address)

  return (
    <>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Address</h2>
        <p>{agreement.address}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          const signState = await signAgreement()
          setSignState(signState!)
        }}
        disabled={!account}
        css={`
          margin-top: 16px;
          font-family: 'Overpass Mono', monospace;
          font-size: 12px;
          position: relative;
          background: transparent;
          color: white;
          cursor: pointer;

          &:active {
            top: 1px;
          }
        `}
      >
        Sign Agreement
      </button>
      {signState && (
        <div
          css={`
            border: 1px solid #00f400;
            margin-top: ${3 * 8}px;
          `}
        >
          {getInfoText(signState)}
        </div>
      )}
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Arbitrator</h2>
        <p>{settings?.arbitrator}</p>
      </div>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Staking pool factory</h2>
        <p>{settings?.cashier} </p>
      </div>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Agreement Title: {settings?.title}</h2>
      </div>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Agreement content</h2>
      </div>
      <a
        href={`https://ipfs.eth.aragon.network/ipfs/${settings?.content}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Content on IPFS
      </a>
    </>
  )
}
