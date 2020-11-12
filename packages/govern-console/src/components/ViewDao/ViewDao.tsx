import React, { useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import 'styled-components/macro'
import Button from '../Button'
import Entity from '../Entity/Entity'
import FilteredActions from '../FilteredActions/FilteredActions'
import Frame from '../Frame/Frame'
import { KNOWN_GOVERN_ROLES, KNOWN_QUEUE_ROLES } from '../../lib/known-roles'
import { ETH_ANY_ADDRESS } from '../../lib/web3-utils'

const ACTIONS_PER_PAGE = 8

type ViewDaoProps = {
  dao: any
}

export default function ViewDao({ dao }: ViewDaoProps) {
  const { daoAddress }: any = useParams()
  const history = useHistory()

  const handleNewAction = useCallback(() => {
    history.push(`/${daoAddress}/new-action`)
  }, [history, daoAddress])

  return (
    <>
      <h2
        css={`
          margin-top: 16px;
          font-size: 24px;
        `}
      >
        {daoAddress} Overview
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
          <li>
            Token:
            <Entity
              address={dao.queue.config.scheduleDeposit.token}
              type="address"
            />
          </li>
          <li>Amount: {dao.queue.config.scheduleDeposit.amount}</li>
        </ul>
        <p>Challenge collateral: </p>
        <ul
          css={`
            margin-left: 16px;
          `}
        >
          <li>
            Token:
            <Entity
              address={dao.queue.config.challengeDeposit.token}
              type="address"
            />
          </li>
          <li>Amount: {dao.queue.config.challengeDeposit.amount}</li>
        </ul>
      </Frame>
      <Frame>
        <div>
          <h2>Actions</h2>
          <div
            css={`
              margin-bottom: 16px;
            `}
          >
            <Button onClick={handleNewAction}>New action</Button>
          </div>
        </div>
        <FilteredActions
          actions={dao.queue.queued}
          actionsPerPage={ACTIONS_PER_PAGE}
        />
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
