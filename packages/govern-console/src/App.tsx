import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import 'styled-components/macro'
import TopHeader from './Components/Header/Header'
import DaoSelector from './pages/DaoSelector'
import DaoView from './pages/DaoView'
import ErcTool from './Tools/Erc'

function App() {
  return (
    <div>
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
