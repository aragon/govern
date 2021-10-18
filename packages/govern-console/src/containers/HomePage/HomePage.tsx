import { Switch } from 'react-router-dom';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import ConsoleMainPage from 'containers/Console/ConsoleMainPage';
import DaoMainPage from 'containers/DAO/DaoMainPage';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import NewExecution from 'containers/NewExecution/NewExecution';
import DaoSettings from 'containers/DAOSettings/DAOSettings';
import NoPageFound from './NoPageFound';
import { ModalsProvider } from 'containers/HomePage/ModalsContext';
import { Main } from '@aragon/ui';
import CreateDao from 'containers/CreateDao/CreateDao';
import { trackPage } from 'services/analytics';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import scrollToTop from 'utils/scrollToId';
import styled from 'styled-components';
import { ApmRoute } from '@elastic/apm-rum-react';

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
              <ApmRoute exact path="/" component={ConsoleMainPage} />
              <ApmRoute exact path="/daos/:daoName" component={DaoMainPage} />
              <ApmRoute exact path="/daos/:daoName/executions/:id" component={ProposalDetails} />
              <ApmRoute exact path="/daos/:daoName/new-execution" component={NewExecution} />
              <ApmRoute exact path="/daos/:daoName/dao-settings" component={DaoSettings} />
              <ApmRoute exact path="/create-dao" component={CreateDao} />
              <ApmRoute exact path="*" component={NoPageFound} />
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
