import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import 'styled-components/macro'
import TopHeader from './components/Header/Header'
import SelectDao from './pages/SelectDao'
import ViewDao from './pages/ViewDao'
import ErcTool from './apps/Erc'

function App() {
  return (
    <div
      css={`
        max-width: 1440px;
        padding: 8px;
        margin: 0 auto;
      `}
    >
      <TopHeader />
      <Router>
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
      </Router>
    </div>
  )
}

export default App
