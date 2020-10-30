import React, { useCallback, useMemo } from 'react'
import {
  Route,
  Switch,
  useHistory,
  useRouteMatch,
  useParams,
} from 'react-router-dom'
import 'styled-components/macro'
import { gql, useQuery } from '@apollo/client'
import Button from '../components/Button'
import NewAction from '../components/NewAction'
import { useChainId } from '../Providers/ChainId'
import { rinkebyClient, mainnetClient } from '../index'

const ANY_ADDRESS = '0xffffffffffffffffffffffffffffffffffffffff'

const KNOWN_QUEUE_ROLES = new Map([
  ['0x25ddcbe0', 'schedule'],
  ['0xecb6cba6', 'execute'],
  ['0x5decc190', 'challenge'],
  ['0xaa455d9f', 'configure'],
  ['0xa0e975cb', 'veto'],
  ['0x586df604', 'ROOT_ROLE'],
])

const KNOWN_GOVERN_ROLES = new Map([['0x5c3e9760', 'exec']])

const DAO_QUERY = gql`
  query DAOQuery($name: String) {
    registryEntry(id: $name) {
      name
      executor {
        address
        roles {
          selector
          who
          frozen
        }
      }
      queue {
        address
        roles {
          selector
          who
          frozen
        }
        queued {
          id
          state
          payload {
            nonce
            executionTime
            submitter
            proof
          }
        }
        config {
          executionDelay
          scheduleDeposit {
            token
            amount
          }
          challengeDeposit {
            token
            amount
          }
          resolver
          rules
        }
      }
    }
  }
`

export default function DaoView() {
  const { chainId } = useChainId()
  const { daoAddress }: any = useParams()
  const { path } = useRouteMatch()
  const { data, loading, error } = useQuery(DAO_QUERY, {
    variables: {
      name: daoAddress,
    },
    client: chainId === 4 ? rinkebyClient : mainnetClient,
  })

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    console.error(error)
    return <p>Error</p>
  }

  if (!data.registryEntry) {
    return <p>DAO not found.</p>
  }

  return (
    <Switch>
      <Route exact path={path}>
        <DaoInfo dao={data.registryEntry} />
        <Actions dao={data.registryEntry} />
        <Permissions dao={data.registryEntry} />
      </Route>
      <Route path={`${path}/new-action`}>
        <NewAction
          config={data.registryEntry.queue.config}
          executorAddress={data.registryEntry.executor.address}
          queueAddress={data.registryEntry.queue.address}
        />
      </Route>
      <Route>
        <h2>Route not found :(</h2>
      </Route>
    </Switch>
  )
}

type DaoInfoProps = {
  dao: any
}

function DaoInfo({ dao }: DaoInfoProps) {
  const { daoAddress }: any = useParams()

  return (
    <>
      <h2
        css={`
          margin-top: 16px;
        `}
      >
        Info for {daoAddress}
      </h2>
      <div
        css={`
          margin-top: 32px;
          border: 1px solid whitesmoke;
          h2 {
            font-weight: bold;
            font-size: 24px;
          }
          h3 {
            font-weight: bold;
            font-size: 18px;
          }
          p {
            margin-bottom: 16px;
            margin-top: 16px;
          }
        `}
      >
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
      </div>
    </>
  )
}

function Actions({ dao }: DaoInfoProps) {
  const history = useHistory()
  const { daoAddress }: any = useParams()

  const handleNewAction = useCallback(() => {
    history.push(`/${daoAddress}/new-action`)
  }, [history, daoAddress])

  const hasActions = useMemo(() => dao.queue.queued.length > 0, [dao])

  return (
    <div
      css={`
        margin-top: 32px;
        border: 1px solid whitesmoke;
        h2 {
          font-weight: bold;
          font-size: 24px;
        }
        h3 {
          font-weight: bold;
          font-size: 18px;
        }
        p {
          margin-bottom: 16px;
          margin-top: 16px;
        }
      `}
    >
      <h2>Actions</h2>
      {hasActions
        ? dao.queue.queued.map(({ id }: { id: string }) => (
            <ActionCard id={id} key={id} />
          ))
        : 'No actions.'}
      <Button onClick={handleNewAction}>New action</Button>
    </div>
  )
}

type PermissionsProps = {
  dao: any
}

function Permissions({ dao }: PermissionsProps) {
  return (
    <>
      <div
        css={`
          width: 100%;
          margin-top: 32px;
          border: 1px solid whitesmoke;
          h2 {
            font-weight: bold;
            font-size: 24px;
          }
          h3 {
            font-weight: bold;
            font-size: 18px;
          }
          p {
            margin-bottom: 16px;
            margin-top: 16px;
          }
        `}
      >
        <h2>Permissions for Govern</h2>
        {dao.executor.roles.map((role: any) => {
          return (
            <div key={role.selector}>
              <h3>
                {KNOWN_GOVERN_ROLES.get(role.selector)} - {role.selector}
              </h3>
              <p>
                Who has permission:{' '}
                {role.who === ANY_ADDRESS ? 'Anyone' : role.who}
              </p>
            </div>
          )
        })}
      </div>
      <div
        css={`
          margin-top: 32px;
          border: 1px solid whitesmoke;
          h2 {
            font-weight: bold;
            font-size: 24px;
          }
          h3 {
            font-weight: bold;
            font-size: 18px;
          }
          p {
            margin-bottom: 16px;
            margin-top: 16px;
          }
        `}
      >
        <h2>Permissions for GovernQueue</h2>
        {dao.queue.roles.map((role: any) => {
          return (
            <div key={role.selector}>
              <h3>
                {KNOWN_QUEUE_ROLES.get(role.selector)} - {role.selector}
              </h3>
              <p>
                Who has permission:{' '}
                {role.who === ANY_ADDRESS ? 'Anyone' : role.who}
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}

type ActionCardProps = {
  id: string
}

function ActionCard({ id }: ActionCardProps) {
  const history = useHistory()

  const handleCardClick = useCallback(() => {
    history.push(`/tools/${id}`)
  }, [history, id])

  return (
    <button
      type="button"
      css={`
        position: relative;
        background: transparent;
        width: 280px;
        height: 320px;
        border: 1px solid #00f400;
        padding: 16px;
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
      {id}
    </button>
  )
}
