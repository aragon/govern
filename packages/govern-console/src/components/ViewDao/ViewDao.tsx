import React, { useCallback, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import 'styled-components/macro'
import Button from '../Button'
import Frame from '../Frame/Frame'
import { KNOWN_GOVERN_ROLES, KNOWN_QUEUE_ROLES } from '../../lib/known-roles'
import { shortenAddress, ETH_ANY_ADDRESS } from '../../lib/web3-utils'

type ViewDaoProps = {
  dao: any
}

export default function ViewDao({ dao }: ViewDaoProps) {
  const { daoAddress }: any = useParams()
  const history = useHistory()

  const handleNewAction = useCallback(() => {
    history.push(`/${daoAddress}/new-action`)
  }, [history, daoAddress])

  const hasActions = useMemo(() => dao.queue.queued.length > 0, [dao])

  return (
    <>
      <h2
        css={`
          margin-top: 16px;
        `}
      >
        Info for {daoAddress}
      </h2>
      <Frame>
        <h2>Govern Executor</h2>
        <h3>Address</h3>
        <p>{dao.executor.address}</p>
        <h2>Govern Queue</h2>
        <h3>Address</h3>
        <p>{dao.queue.address}</p>
        <h3>Config</h3>
        <p>Execution delay: {dao.queue.config.executionDelay}</p>
        <p>Schedule collateral: </p>
        <ul
          css={`
            margin-left: 16px;
          `}
        >
          <li>Token: {dao.queue.config.scheduleDeposit.token}</li>
          <li>Amount: {dao.queue.config.scheduleDeposit.amount}</li>
        </ul>
        <p>Challenge collateral: </p>
        <ul
          css={`
            margin-left: 16px;
          `}
        >
          <li>Token: {dao.queue.config.challengeDeposit.token}</li>
          <li>Amount: {dao.queue.config.challengeDeposit.amount}</li>
        </ul>
      </Frame>
      <Frame>
        <h2>Actions</h2>
        {hasActions
          ? dao.queue.queued.map(({ id }: { id: string }) => (
              <ActionCard id={id} key={id} />
            ))
          : 'No actions.'}
        <div>
          <Button onClick={handleNewAction}>New action</Button>
        </div>
      </Frame>
      <Frame>
        <h2>Permissions for Govern</h2>
        {dao.executor.roles.map((role: any) => {
          return (
            <div key={role.selector}>
              <h3>
                {KNOWN_GOVERN_ROLES.get(role.selector)} - {role.selector}
              </h3>
              <p>
                Who has permission:{' '}
                {role.who === ETH_ANY_ADDRESS ? 'Anyone' : role.who}
              </p>
            </div>
          )
        })}
      </Frame>
      <Frame>
        <h2>Permissions for GovernQueue</h2>
        {dao.queue.roles.map((role: any) => {
          return (
            <div key={role.selector}>
              <h3>
                {KNOWN_QUEUE_ROLES.get(role.selector)} - {role.selector}
              </h3>
              <p>
                Who has permission:{' '}
                {role.who === ETH_ANY_ADDRESS ? 'Anyone' : role.who}
              </p>
            </div>
          )
        })}
      </Frame>
    </>
  )
}

type ActionCardProps = {
  id: string
}

function ActionCard({ id }: ActionCardProps) {
  const history = useHistory()
  const { daoAddress }: any = useParams()

  const handleCardClick = useCallback(() => {
    history.push(`${daoAddress}/view-action/${id}`)
  }, [daoAddress, history, id])

  return (
    <button
      type="button"
      css={`
        position: relative;
        background: transparent;
        width: 280px;
        height: 320px;
        border: 2px solid transparent;
        border-image: linear-gradient(
          to bottom right,
          #ad41bb 20%,
          #ff7d7d 100%
        );
        border-image-slice: 1;
        padding: 16px;
        margin-right: 8px;
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 24px;
          margin-bottom: 24px;
        }
        &:active {
          top: 1px;
        }
      `}
      onClick={handleCardClick}
    >
      {shortenAddress(id)}
    </button>
  )
}
