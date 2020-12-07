import React, { useEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import 'styled-components/macro'
import SelectDao from './pages/SelectDao'
import ViewDao from './pages/ViewDao'
import TopHeader from './components/Header/Header'
import { useChainId } from './Providers/ChainId'
import { getNetworkName } from './lib/web3-utils'

function App() {
  const location: any = useLocation()
  const { chainId } = useChainId()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div
      css={`
        max-width: 1440px;
        padding: 8px;
        margin: 0 auto;
      `}
    >
      <TopHeader />
      <Switch>
        <Route exact path="/">
          <Redirect to={`/${getNetworkName(chainId)}`} />
        </Route>
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
