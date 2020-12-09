import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import TokenAmount from 'token-amount'
import 'styled-components/macro'
import Button from '../Button'
import Entity from '../Entity/Entity'
import FilteredActions from '../FilteredActions/FilteredActions'
import Frame from '../Frame/Frame'
import { useChainId } from '../../Providers/ChainId'
import { usePermissions } from '../../Providers/Permissions'
import { useWalletAugmented } from '../../Providers/Wallet'
import { KNOWN_GOVERN_ROLES, KNOWN_QUEUE_ROLES } from '../../lib/known-roles'
import {
  getNetworkName,
  ETH_ANY_ADDRESS,
  ETH_EMPTY_HEX,
} from '../../lib/web3-utils'

const ACTIONS_PER_PAGE = 8

type ViewDaoProps = {
  dao: any
}

export default function ViewDao({ dao }: ViewDaoProps) {
  const [ethBalance, setEthBalance] = useState('')
  const { daoAddress }: any = useParams()
  const history = useHistory()
  const { ethers } = useWalletAugmented()
  const { permissions, populatePermissions } = usePermissions()
  const { chainId } = useChainId()

  populatePermissions(dao.queue.roles)
  const { schedule: canSchedule } = permissions

  useEffect(() => {
    async function fetchEthBalance() {
      const balance = await ethers.getBalance(dao.executor.address)
      setEthBalance(balance.toString())
    }
    fetchEthBalance()
  }, [dao, ethers])

  const handleNewAction = useCallback(() => {
    history.push(`/${getNetworkName(chainId)}/${daoAddress}/new-action`)
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
        <h3>ETH balance</h3>
        <p>
          {' '}
          {TokenAmount.format(ethBalance, 18, {
            symbol: 'Ξ',
          })}{' '}
        </p>
      </Frame>
      <Frame>
        <h2>Govern Executor</h2>
        <h3>Address</h3>
        <p>
          <Entity address={dao.executor.address} type="address" />
        </p>
        <h2>Govern Queue</h2>
        <h3>Address</h3>
        <p>
          <Entity address={dao.queue.address} type="address" />
        </p>
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
        <h3>Rules</h3>
        <p>
          {dao.queue.config.rules === ETH_EMPTY_HEX ? (
            'No agreement attached.'
          ) : (
            <Entity address={dao.queue.config.rules} type="address" />
          )}
        </p>
      </Frame>
      <Frame>
        <div>
          <h2>Actions</h2>
          <div
            css={`
              margin-bottom: 16px;
            `}
          >
            {canSchedule && (
              <Button onClick={handleNewAction}>New action</Button>
            )}
          </div>
        </div>
        <FilteredActions
          actions={dao.queue.queued}
          actionsPerPage={ACTIONS_PER_PAGE}
        />
      </Frame>
      <Frame>
        <h2>Permissions for Govern</h2>
        <table
          css={`
            width: 100%;
            text-align: left;
          `}
        >
          <thead>
            <tr>
              <th>Role (function)</th>
              <th>Assigned to entity</th>
            </tr>
          </thead>
          <tbody>
            {dao.executor.roles.map((role: any, idx: number) => {
              return (
                <tr key={idx}>
                  <td>
                    {KNOWN_GOVERN_ROLES.get(role.selector)} - {role.selector}
                  </td>
                  <td>
                    <Entity
                      address={
                        role.who === ETH_ANY_ADDRESS ? 'Anyone' : role.who
                      }
                      type="address"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Frame>
      <Frame>
        <h2>Permissions for GovernQueue</h2>
        <table
          css={`
            width: 100%;
            text-align: left;
          `}
        >
          <thead>
            <tr>
              <th>Role (function)</th>
              <th>Assigned to entity</th>
            </tr>
          </thead>
          <tbody>
            {dao.queue.roles.map((role: any, idx: number) => {
              return (
                <tr key={idx}>
                  <td>
                    {KNOWN_QUEUE_ROLES.get(role.selector)} - {role.selector}
                  </td>
                  <td>
                    <Entity
                      address={
                        role.who === ETH_ANY_ADDRESS ? 'Anyone' : role.who
                      }
                      type="address"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Frame>
    </>
  )
}
