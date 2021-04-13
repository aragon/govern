import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Header from 'components/Header/Header';
// import NavigationBar from '../../components/Navigation';
import { styled } from '@material-ui/core/styles';
import { ConsoleMainPage } from 'containers/Console/ConsoleMainPage';

const HomePage = ({ ...props }) => {
  const AppWrapper = styled('div')({
    width: 'calc(100vw - 96px)',
    margin: 'auto',
  });

  const [selectedDao, updateSelectedDao] = React.useState({});

  const DaoContext = React.createContext({
    selectedDao,
    updateSelectedDao,
    // updateSelectedDao: (daoDetails: any) => {
    //   selectedDao = daoDetails;
    // },
  });

  return (
    <Router>
      <AppWrapper>
        <Header />
        {/* <NavigationBar /> */}
        <Switch>
          <div>
            <Route exact path="/">
              <ConsoleMainPage />
            </Route>
            {/* <Route exact path="/">
              <ConsoleMainPage />
            </Route> */}
            {/* <Route path="/about">
        <About />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
    */}
          </div>
        </Switch>
        {/* <Footer /> */}
      </AppWrapper>
    </Router>
  );
};

export default HomePage;
