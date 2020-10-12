import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import 'styled-components/macro'
import DaoSelector from './components/DaoSelector'
import TopHeader from './components/Header/Header'
import DaoView from './DaoView/DaoView'
import ErcTool from './Tools/Erc'

function App() {
  return (
    <div
      css={`
        padding: 8px;
      `}
    >
      <TopHeader />
      <Router>
        <Switch>
          <Route exact path="/">
            <DaoSelector />
          </Route>
          <Route exact path="/tools/erc">
            <ErcTool />
          </Route>
          <Route path="/:daoAddress">
            <DaoView />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
