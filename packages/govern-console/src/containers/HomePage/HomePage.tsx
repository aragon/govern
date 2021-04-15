import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';

import Header from 'components/Header/Header';
// import NavigationBar from '../../components/Navigation';
import { ConsoleMainPage } from 'containers/Console/ConsoleMainPage';
import { DaoMainPage } from 'containers/DAO/DaoMainPage';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import NewProposal from 'containers/NewProposal/NewProposal';

const HomePage = ({ ...props }) => {
  const AppWrapper = styled('div')({
    width: 'calc(100vw - 96px)',
    margin: 'auto',
  });
  const history = useHistory();
  debugger;
  const [selectedDao, updateSelectedDao] = React.useState({});
  const updateSelectedDaoAndPushToHistory = React.useCallback(
    (daoDetails: any) => {
      history.push(`daos/${daoDetails.name}`, {
        daoDetails,
      });
    },
    [history],
  );
  const onClickProposalCard = React.useCallback(
    (proposalDetails: any) => {
      history.push(`/proposals/${proposalDetails.id}`, {
        proposalDetails,
      });
    },
    [history],
  );
  const onClickBackFromProposalPage = () => {
    history.goBack();
  };
  return (
    <AppWrapper>
      <Header />
      {/* add breadcrumbs later */}
      <Switch>
        <div>
          <Route exact path="/">
            <ConsoleMainPage
              updateSelectedDao={updateSelectedDaoAndPushToHistory}
            />
          </Route>
          <Route exact path="/daos/:daoName">
            <DaoMainPage onClickProposalCard={onClickProposalCard} />
          </Route>
          <Route exact path="/proposals/:id">
            <ProposalDetails onClickBack={onClickBackFromProposalPage} />
          </Route>
          <Route exact path="/new-proposal">
            <NewProposal />
          </Route>
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
  );
};

export default HomePage;
