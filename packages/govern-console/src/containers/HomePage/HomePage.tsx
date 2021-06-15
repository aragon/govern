import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
// import { styled } from '@material-ui/core/styles';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import ConsoleMainPage from 'containers/Console/ConsoleMainPage';
import DaoMainPage from 'containers/DAO/DaoMainPage';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import NewProposal from 'containers/NewProposal/NewProposal';
import DaoSettings from 'containers/DAOSettings/DAOSettings';
import { ModalsProvider } from 'containers/HomePage/ModalsContext';
import { Main } from '@aragon/ui';
import CreateDao from '../CreateDao/CreateDao';
import { useState } from 'react';

const HomePage = () => {
  const history = useHistory();
  const [themeMode, setThemeMode] = useState('light');
  const toggleThemeMode = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('light');
    }
  };

  return (
    <ModalsProvider>
      <Main theme={themeMode}>
        <Header toggleTheme={toggleThemeMode} themeMode={themeMode} />
        <Switch>
          <Route exact path="/">
            <ConsoleMainPage />
          </Route>
          <Route exact path="/daos/:daoName">
            <DaoMainPage />
          </Route>
          <Route exact path="/proposals/:daoName/:id">
            <ProposalDetails onClickBack={() => history.goBack()} />
          </Route>
          <Route exact path="/daos/:daoName/new-proposal">
            <NewProposal onClickBack={() => history.goBack()} />
          </Route>
          <Route exact path="/daos/:daoName/dao-settings">
            <DaoSettings onClickBack={() => history.goBack()} />
          </Route>
          <Route exact path="/create-dao">
            <CreateDao />
          </Route>
        </Switch>
        <Footer />
      </Main>
    </ModalsProvider>
  );
};

export default HomePage;
