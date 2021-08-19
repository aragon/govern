import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import ConsoleMainPage from 'containers/Console/ConsoleMainPage';
import DaoMainPage from 'containers/DAO/DaoMainPage';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import NewExecution from 'containers/NewExecution/NewExecution';
import DaoSettings from 'containers/DAOSettings/DAOSettings';
import { ModalsProvider } from 'containers/HomePage/ModalsContext';
import { Main } from '@aragon/ui';
import CreateDao from 'containers/CreateDao/CreateDao';
import { trackPage } from 'services/analytics';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import scrollToTop from 'utils/scrollToId';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-areas:
    'body'
    'footer';
`;

const BodyArea = styled.div`
  grid-area: body;
  min-height: 90vh;
`;

const FooterArea = styled.div`
  grid-area: footer;
`;

const HomePage = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    trackPage(pathname);

    // scroll to top on path change
    scrollToTop();
  }, [pathname]);

  return (
    <ModalsProvider>
      <Main theme="light" toastProps={{ top: true, position: 'center' }}>
        <Container>
          <BodyArea>
            <Header />
            <Switch>
              <Route exact path="/">
                <ConsoleMainPage />
              </Route>
              <Route exact path="/daos/:daoName">
                <DaoMainPage />
              </Route>
              <Route exact path="/daos/:daoName/executions/:id">
                <ProposalDetails onClickBack={() => history.goBack()} />
              </Route>
              <Route exact path="/daos/:daoName/new-execution">
                <NewExecution />
              </Route>
              <Route exact path="/daos/:daoName/dao-settings">
                <DaoSettings onClickBack={() => history.goBack()} />
              </Route>
              <Route exact path="/create-dao">
                <CreateDao />
              </Route>
            </Switch>
          </BodyArea>
          <FooterArea>
            <Footer />
          </FooterArea>
        </Container>
      </Main>
    </ModalsProvider>
  );
};

export default HomePage;
