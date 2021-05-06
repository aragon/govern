/* eslint-disable */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
// import NavigationBar from 'components/Navigation';
import ConsoleMainPage from 'containers/Console/ConsoleMainPage';
import DaoMainPage from 'containers/DAO/DaoMainPage';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import NewProposal from 'containers/NewProposal/NewProposal';
import NewDaoContainer from 'containers/CreateDAO/CreateDAO';
import DaoSettingsContainer from 'containers/DAOSettings/DAOSettings';
import { ModalsProvider } from 'containers/HomePage/ModalsContext';

const AppWrapper = styled('div')({
  width: 'calc(100vw - 96px)',
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

const HomePage = ({ ...props }) => {
  const history = useHistory();
  const [selectedDao, updateSelectedDao] = React.useState<any>({});
  const [selectedProposal, updateSelectedProposal] = React.useState<any>({});

  const updateSelectedDaoAndPushToHistory = React.useCallback(
    (daoDetails: any) => {
      updateSelectedDao(daoDetails);
      sessionStorage.setItem('selectedDao', JSON.stringify(daoDetails));
      history.push(`/daos/${daoDetails.name}`);
    },
    [history],
  );
  const onClickProposalCard = React.useCallback(
    (proposalDetails: any) => {
      history.push(`/proposals/${proposalDetails.id}`);
      sessionStorage.setItem(
        'selectedProposal',
        JSON.stringify(proposalDetails),
      );
      updateSelectedProposal(proposalDetails);
    },
    [history],
  );
  const onClickNewProposal = React.useCallback(() => {
    history.push(`/${selectedDao.name}/new-proposal`);
  }, [history, selectedDao]);

  const onClickBackFromProposalPage = () => {
    history.goBack();
  };
  const onSearchByDaoName = (daoName: string) => {
    history.push(`/daos/${daoName}`);
  };
  return (
    <ModalsProvider>
      <AppWrapper id="app-wrapper">
        <Header />
        {/* add breadcrumbs later */}
        <Switch>
          <MainBodyWrapper id="main-body-wrapper">
            <Route exact path="/">
              <ConsoleMainPage
                updateSelectedDao={updateSelectedDaoAndPushToHistory}
                onSearchByDaoName={onSearchByDaoName}
              />
            </Route>
            <Route exact path="/daos/:daoName">
              <DaoMainPage
                onClickProposalCard={onClickProposalCard}
                onClickNewProposal={onClickNewProposal}
              />
            </Route>
            <Route exact path="/proposals/:daoName/:id">
              <ProposalDetails onClickBack={() => history.goBack()} />
            </Route>
            <Route exact path="/daos/:daoName/new-proposal">
              <NewProposal onClickBack={() => history.goBack()} />
            </Route>
            <Route exact path="/daos/:daoName/dao-settings">
              <DaoSettingsContainer onClickBack={() => history.goBack()} />
            </Route>
            <Route exact path="/create-dao">
              <NewDaoContainer />
            </Route>
            {/* <Route path="/about">
        <About />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
    */}
          </MainBodyWrapper>
        </Switch>
        <Footer />
        {/* <Footer /> */}
      </AppWrapper>
    </ModalsProvider>
  );
};

export default HomePage;
