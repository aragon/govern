import styled from 'styled-components';
import { ApmRoute } from '@elastic/apm-rum-react';
import { Grid, GridItem, GU, useLayout } from '@aragon/ui';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Redirect, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router';

import DaoSideCard from './components/DaoSideCard/DaoSideCard';
import NewExecution from 'containers/NewExecution/NewExecution';
import HelpComponent from 'components/HelpComponent/HelpComponent';
import DaoActionsPage from './DaoActionPage';
import DaoFinancePage from './DaoFinancePage';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import {
  proposalNewActionsUrl,
  proposalSettingsUrl,
  DaoFinanceUrl,
  NotFoundUrl,
  DaoSettingsUrl,
  ActionDetailsUrl,
  NewActionUrl,
  DaoNotFoundUrl,
} from 'utils/urls';
import { useDaoQuery } from 'hooks/query-hooks';
const DaoSettings = lazy(() => import('containers/DAOSettings/DAOSettings'));

const StyledGridItem = styled(GridItem)<{ paddingTop: string }>`
  padding-top: ${({ paddingTop }) => paddingTop};
`;

/**
 * Main page taking care of the routing to various dao functions;
 * pulls all the data (for now at least)
 */
const DaoHomePage: React.FC = () => {
  const history = useHistory();
  const { daoName } = useParams<any>();
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  /**
   * State
   */
  const [daoExists, setDaoExists] = useState<boolean>(true);

  /**
   * Effects
   */
  const { data: dao, loading: daoIsLoading } = useDaoQuery(daoName);

  /**
   * Update state and get queue data
   */
  useEffect(() => {
    if (daoIsLoading) return;

    if (dao) {
      setDaoExists(true);
    } else {
      setDaoExists(false);
    }
  }, [daoIsLoading, dao]);

  /**
   * Render
   */
  if (daoIsLoading) {
    return <div>Loading...</div>;
  }

  if (!daoExists) {
    history.replace(DaoNotFoundUrl);
  }

  // TODO: Set API call to get open action(scheduled + executable)
  return (
    <Grid
      layout={true}
      gap={24}
      css={`
        margin-top: ${layoutIsSmall ? '16' : '40'}px;
      `}
    >
      <GridItem gridColumn={layoutIsSmall ? '1/-1' : '1/5'}>
        <DaoSideCard address={dao?.queue?.address} baseUrl={url} identifier={daoName} />
      </GridItem>
      <StyledGridItem
        gridRow={layoutIsSmall ? '2/4' : '1/4'}
        gridColumn={layoutIsSmall ? '1/-1' : '5/17'}
        paddingTop={layoutIsSmall ? '0px' : `${3 * GU}px`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Redirect exact from={path} to={`${path}actions`} />
            <ApmRoute
              exact
              path={`${path}actions`}
              render={() => (
                <DaoActionsPage daoName={daoName} daoID={dao?.queue?.id} queue={dao?.queue} />
              )}
            />
            <ApmRoute
              exact
              path={`${path}${DaoFinanceUrl}`}
              render={() => (
                <DaoFinancePage
                  daoName={daoName}
                  executorId={dao?.executor.id}
                  token={dao?.token}
                />
              )}
            />
            <ApmRoute exact path={`${path}${DaoSettingsUrl}`} component={DaoSettings} />
            <ApmRoute exact path={`${path}${ActionDetailsUrl}`} component={ProposalDetails} />
            <ApmRoute exact path={`${path}${NewActionUrl}`} component={NewExecution} />
            <ApmRoute render={() => history.push(NotFoundUrl)} />
          </Switch>
        </Suspense>
      </StyledGridItem>
      {(pathname === proposalSettingsUrl(url) || pathname === proposalNewActionsUrl(url)) && (
        <GridItem
          gridRow={layoutIsSmall ? '4/5' : '2/3'}
          gridColumn={layoutIsSmall ? '1/-1' : '1/5'}
        >
          <HelpComponent />
        </GridItem>
      )}
    </Grid>
  );
};

export default DaoHomePage;
