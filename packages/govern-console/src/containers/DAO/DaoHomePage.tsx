import styled from 'styled-components';
import { ApmRoute } from '@elastic/apm-rum-react';
import { Grid, GridItem, GU, useLayout } from '@aragon/ui';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Redirect, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router';

import DaoSideCard from './components/DaoSideCard/DaoSideCard';
import NewExecution from 'containers/NewExecution/NewExecution';
import HelpComponent from 'components/HelpComponent/HelpComponent';
import ProposalDetails from 'containers/ProposalDetails/ProposalDetails';
import { useDaoQuery, useLazyProposalListQuery } from 'hooks/query-hooks';

const DaoSettings = lazy(() => import('containers/DAOSettings/DAOSettings'));

const StyledGridItem = styled(GridItem)`
  padding-top: ${3 * GU}px;
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

  /**
   * State
   */
  const [daoExists, setDaoExists] = useState<boolean>(true);
  const [daoDetails, setDaoDetails] = useState<any>();
  const [queueNonce, setQueueNonce] = useState<number>();
  const [visibleActions, setVisibleActions] = useState<any>([]);

  /**
   * Effects
   */
  const { data: dao, loading: daoIsLoading } = useDaoQuery(daoName);
  const { getQueueData, data: queueData, fetchMore } = useLazyProposalListQuery();

  /**
   * Update state and get queue data
   */
  useEffect(() => {
    if (daoIsLoading) return;

    if (dao && getQueueData) {
      setDaoExists(true);
      setDaoDetails(dao);

      if (dao.queue) {
        getQueueData({
          variables: {
            offset: 0,
            limit: 16,
            id: dao.queue.id,
          },
        });
      }
    } else {
      setDaoExists(false);
    }
  }, [daoIsLoading, dao, getQueueData]);

  /**
   * Update visible proposals
   */
  useEffect(() => {
    if (queueData) {
      setQueueNonce(parseInt(queueData.governQueue.nonce));
      setVisibleActions(queueData.governQueue.containers);
    }
  }, [queueData]);

  /**
   * Functions
   */
  const fetchMoreData = async () => {
    if (fetchMore) {
      fetchMore({
        variables: {
          offset: visibleActions.length,
        },
      });
    }
  };

  /**
   * Render
   */
  if (daoIsLoading) {
    return <div>Loading...</div>;
  }

  if (!daoExists) {
    history.replace('/daos/not-found');
  }

  return (
    <Grid layout={true} gap={24}>
      <GridItem gridColumn={layoutName === 'small' ? '1/-1' : '1/5'}>
        <DaoSideCard
          address={dao?.queue?.address}
          baseUrl={url}
          identifier={daoName}
          openActions="2"
        />
      </GridItem>
      <StyledGridItem
        gridRow={layoutName === 'small' ? '2/4' : '1/4'}
        gridColumn={layoutName === 'small' ? '1/-1' : '5/17'}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Redirect exact from={path} to={`${path}actions`} />
            <ApmRoute
              exact
              path={`${path}actions`}
              render={() => <div>Actions Component goes here...</div>}
            />
            <ApmRoute
              exact
              path={`${path}finance`}
              render={() => <div>Finance Component goes here...</div>}
            />
            <ApmRoute exact path={`${path}settings`} component={DaoSettings} />
            <ApmRoute exact path={`${path}new-execution`} component={NewExecution} />
            <ApmRoute exact path={`${path}executions/:id`} component={ProposalDetails} />

            {/* TODO: Operation not found page */}
            <ApmRoute render={() => <div>Operation not found on dao. Go home?</div>} />
          </Switch>
        </Suspense>
      </StyledGridItem>
      {pathname === `${url}/settings` && (
        <GridItem
          gridRow={layoutName === 'small' ? '4/5' : '2/3'}
          gridColumn={layoutName === 'small' ? '1/-1' : '1/5'}
        >
          <HelpComponent />
        </GridItem>
      )}
    </Grid>
  );
};

export default DaoHomePage;
