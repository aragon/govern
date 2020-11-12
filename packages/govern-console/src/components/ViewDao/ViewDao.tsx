import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import TokenAmount from 'token-amount'
import 'styled-components/macro'
import Button from '../Button'
import Entity from '../Entity/Entity'
import FilteredActions from '../FilteredActions/FilteredActions'
import Frame from '../Frame/Frame'
import { useWalletAugmented } from '../../Providers/Wallet'
import { KNOWN_GOVERN_ROLES, KNOWN_QUEUE_ROLES } from '../../lib/known-roles'
import { ETH_ANY_ADDRESS } from '../../lib/web3-utils'

const ACTIONS_PER_PAGE = 8

type ViewDaoProps = {
  dao: any
}

const BASE_ETHERSCAN_TX_URL =
  'https://api.etherscan.io/api?module=account&action=txlistinternal&address='

export default function ViewDao({ dao }: ViewDaoProps) {
  const [ethBalance, setEthBalance] = useState('')
  const { daoAddress }: any = useParams()
  const history = useHistory()
  const { isLoading, error, data: tokenData } = useQuery(
    'daoActivity',
    async () => {
      const res = await axios.get(
        `${BASE_ETHERSCAN_TX_URL}${dao.executor.address}&apiKey=${process.env.REACT_APP_ETHERSCAN_API_TOKEN}`,
      )
      console.log(res)
      return res
    },
  )
  const { ethers } = useWalletAugmented()

  useEffect(() => {
    async function fetchEthBalance() {
      const balance = await ethers.getBalance(dao.executor.address)
      console.log(balance)
      setEthBalance(balance.toString())
    }
    fetchEthBalance()
  }, [dao, ethers])

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
