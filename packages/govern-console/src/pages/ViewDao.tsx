import React from 'react'
import { Route, Switch, useRouteMatch, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { gql, request } from 'graphql-request'
import 'styled-components/macro'
import NewAction from '../components/NewAction/NewAction'
import ViewAction from '../components/ViewAction/ViewAction'
import ViewDao from '../components/ViewDao/ViewDao'
import { useChainId } from '../Providers/ChainId'
import env from '../environment'

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
            actions {
              id
              to
              value
              data
            }
            executor {
              address
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
          history {
            ... on ContainerEventVeto {
              reason
            }
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
  const { data, isLoading: loading, error } = useQuery(
    // This is the key for retrieving the data from react-query's cache;
    // originally we were using the same key for this DAO query, no matter
    // which DAO, but having an unique (but reproducible) key per DAO lets
    // us store data on the user browser and persist it while avoiding
    // false "info" flashes on other DAOs due to key collisions
    `DAO_DATA_${daoAddress}`,
    async () =>
      request(
        chainId === 4
          ? env('RINKEBY_SUBGRAPH_URL')
          : env('MAINNET_SUBGRAPH_URL'),
        DAO_QUERY,
        {
          name: daoAddress,
        },
      ),
  )

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
        <ViewDao dao={data.registryEntry} />
      </Route>
      <Route path={`${path}/new-action`}>
        <NewAction
          config={data.registryEntry.queue.config}
          executorAddress={data.registryEntry.executor.address}
          queueAddress={data.registryEntry.queue.address}
        />
      </Route>
      <Route path={`${path}/view-action/:containerId`}>
        <ViewAction
          containers={data.registryEntry.queue.queued}
          queueAddress={data.registryEntry.queue.address}
        />
      </Route>
      <Route>
        <h2>Route not found :(</h2>
      </Route>
    </Switch>
  )
}
