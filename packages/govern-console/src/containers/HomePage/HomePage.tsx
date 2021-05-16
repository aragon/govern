import React, { useCallback } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import ConsoleMainPage from 'containers/Console/ConsoleMainPage';
import DaoMainPage from 'containers/DAO/DaoMainPage';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import NewProposal from 'containers/NewProposal/NewProposal';
import CreateDao from 'containers/CreateDAO/CreateDao';
import DaoSettings from 'containers/DAOSettings/DAOSettings';
import { ModalsProvider } from 'containers/HomePage/ModalsContext';

const AppWrapper = styled('div')({
  width: 'calc(100vw - 96px)',
  maxWidth: '1440px',
  margin: 'auto',
  boxSizing: 'border-box',
  position: 'relative',
  minHeight: '100vh',
});

const MainBodyWrapper = styled('div')({
  width: '100%',
  minHeight: 'calc(100vh - 212px)',
  boxSizing: 'border-box',
  top: '106px',
  overflowX: 'hidden',
  overflowY: 'auto',
});

const HomePage = () => {
  const history = useHistory();

  const updateSelectedDaoAndPushToHistory = useCallback(
    (daoDetails: any) => {
      sessionStorage.setItem('selectedDao', JSON.stringify(daoDetails));
      history.push(`/daos/${daoDetails.name}`);
    },
    [history],
  );

  const onSearchByDaoName = (daoName: string) => {
    history.push(`/daos/${daoName}`);
  };

  return (
    <ModalsProvider>
      <AppWrapper id="app-wrapper">
        <Header />
        {/* add breadcrumbs later */}
        <MainBodyWrapper id="main-body-wrapper">
          <Switch>
            <Route exact path="/">
              <ConsoleMainPage
              // updateSelectedDao={updateSelectedDaoAndPushToHistory}
              // onSearchByDaoName={onSearchByDaoName}
              />
            </Route>
            <Route exact path="/daos/:daoName">
              <DaoMainPage
              // onClickProposalCard={onClickProposalCard}
              // onClickNewProposal={onClickNewProposal}
              />
            </Route>
            <Route exact path="/proposals/:daoName/:id">
              <ProposalDetails onClickBack={() => history.goBack()} />
            </Route>
            <Route exact path="/daos/:daoName/new-proposal">
              <NewProposal onClickBack={() => history.goBack()} />
            </Route>
            <Route exact path="/daos/:daoName/dao-settings">
              <DaoSettings />
            </Route>
            <Route exact path="/create-dao">
              <CreateDao />
            </Route>
          </Switch>
        </MainBodyWrapper>
        <Footer />
      </AppWrapper>
    </ModalsProvider>
  );
};

export default HomePage;
