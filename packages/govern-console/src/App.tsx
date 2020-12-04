import React, { useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import 'styled-components/macro'
import TopHeader from './components/Header/Header'
import SelectDao from './pages/SelectDao'
import ViewDao from './pages/ViewDao'
import ErcTool from './apps/Erc'

function App() {
  const location: any = useLocation()

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
          <SelectDao />
        </Route>
        <Route exact path="/tools/erc">
          <ErcTool />
        </Route>
        <Route path="/:daoAddress">
          <ViewDao />
        </Route>
      </Switch>
    </div>
  )
}

export default App
