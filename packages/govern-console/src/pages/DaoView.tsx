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
import Frame from '../components/Frame/Frame'
import NewAction from '../components/NewAction'
import { useChainId } from '../Providers/ChainId'
import { rinkebyClient, mainnetClient } from '../index'

const ANY_ADDRESS = '0xffffffffffffffffffffffffffffffffffffffff'

const KNOWN_QUEUE_ROLES = new Map([
  ['0x977d8964', 'schedule'],
  ['0x3a139c71', 'execute'],
  ['0x70576158', 'challenge'],
  ['0x72896761', 'configure'],
  ['0xc04c87b8', 'veto'],
  ['0x586df604', 'ROOT_ROLE'],
])

const KNOWN_GOVERN_ROLES = new Map([['0xc2d85afc', 'exec']])

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
    return <p>Loading DAO data...</p>
  }

  if (error) {
    console.error(error)
    return <p>Error fetching DAO data.</p>
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
    <Frame>
      <h2>Actions</h2>
      {hasActions
        ? dao.queue.queued.map(({ id }: { id: string }) => (
            <ActionCard id={id} key={id} />
          ))
        : 'No actions.'}
      <Button onClick={handleNewAction}>New action</Button>
    </Frame>
  )
}

type PermissionsProps = {
  dao: any
}

function Permissions({ dao }: PermissionsProps) {
  return (
    <>
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
                {role.who === ANY_ADDRESS ? 'Anyone' : role.who}
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
                {role.who === ANY_ADDRESS ? 'Anyone' : role.who}
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
      {id}
    </button>
  )
}
