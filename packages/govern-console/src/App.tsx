import React, { useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import 'styled-components/macro'
import SelectDao from './pages/SelectDao'
import ViewDao from './pages/ViewDao'
import Header from './components/Header/Header'
import { useChainId } from './lib/chain-id'
import env from './environment'

function App(): JSX.Element {
  const location = useLocation()
  const { chainId, updateChainId } = useChainId()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // If the ChainId doesn’t exist, we redirect
  // to the default, defined in the environment.
  useEffect(() => {
    if (chainId === -1) {
      updateChainId(env('CHAIN_ID'))
    }
  }, [chainId, updateChainId])

  return (
    <div
      css={`
        max-width: 1440px;
        padding: 8px;
        margin: 0 auto;
      `}
    >
      <Header />
      <Switch>
        <Route exact path="/:network">
          <SelectDao />
        </Route>
        <Route path="/:network/:daoAddress">
          <ViewDao />
        </Route>
      </Switch>
    </div>
  )
}

export default App
