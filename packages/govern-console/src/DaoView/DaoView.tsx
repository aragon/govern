import React from 'react'
import {
  Route,
  Switch,
  useRouteMatch,
  useParams,
} from 'react-router-dom'
import 'styled-components/macro'
import { gql, useQuery } from '@apollo/client'
import { useChainId } from '../Providers/ChainId'

const DAO_QUERY = gql`
  query DAOQuery($id: String) {
    eaglet(id: $id) {
    address
    name
    queue {
      address
      containers {
        id
        executionState
        vetoReason
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
        vetoDeposit {
          token
          amount
        }
        resolver
        rules
      }
      roles {
        id
        role
        who
        revoked
      }
    }
    roles {
      id
      role
      who
      revoked
    }
  }
}
`


export default function DaoView() {
  const { daoAddress }: any = useParams()
  const { path } = useRouteMatch()
  const { data, loading, error } = useQuery(DAO_QUERY, {
    variables: {
      id: daoAddress
    }
  })

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    console.log(error)
    return <p>Error</p>
  }

  console.log(data)

  return (
    <Switch>
      <Route exact path={path}>
        <DaoInfo dao={data} />
      </Route>
      <Route>
        <h2>not found :(</h2>
      </Route>
    </Switch>
  )
}

type DaoInfoProps = {
  dao: any
}

function DaoInfo({ dao }: DaoInfoProps) {
  return (
    <>
    <h2 css={`
      margin-top: ${2 * 8}px;
    `}>Info for {dao.eaglet.name}</h2>
    <div
      css={`
        padding: 8px;
        margin-top: ${4 * 8}px;
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
      <h2>Govern</h2>
      <h3>Address</h3>
      <p>{dao.eaglet.address}</p>
      <h2>Optimistic Queue</h2>
      <h3>Address</h3>
      <p>{dao.eaglet.address}</p>
      <h3>Config</h3>
      <p>Execution delay: {dao.eaglet.queue.config.executionDelay}</p>
      <p>Schedule collateral: </p>
      <ul css={`
        margin-left: 16px;
      `}>
        <li>Token: {dao.eaglet.queue.config.scheduleDeposit.token}</li>
        <li>Amount: {dao.eaglet.queue.config.scheduleDeposit.amount}</li>
      </ul>
      <p>Challenge collateral: </p>
      <ul css={`
        margin-left: 16px;
      `}>
        <li>Token: {dao.eaglet.queue.config.challengeDeposit.token}</li>
        <li>Amount: {dao.eaglet.queue.config.challengeDeposit.amount}</li>
      </ul>
      <p>Veto collateral: </p>
      <ul css={`
        margin-left: 16px;
      `}>
        <li>Token: {dao.eaglet.queue.config.vetoDeposit.token}</li>
        <li>Amount: {dao.eaglet.queue.config.vetoDeposit.amount}</li>
      </ul>
    </div>
    </>
  )
}