import { ApmRoute } from '@elastic/apm-rum-react';
import { useEffect, useState } from 'react';
import { Grid, GridItem, useLayout } from '@aragon/ui';
import { Redirect, Switch, useLocation, useParams, useRouteMatch } from 'react-router';

import NoDaoFound from './NoDaoFound';
import DaoSideCard from './components/DaoSideCard/DaoSideCard';
import DaoActionsPage from './DaoActionPage';
import { useDaoQuery, useLazyProposalListQuery } from 'hooks/query-hooks';
import HelpComponent from 'components/HelpComponent/HelpComponent';
import NewExecution from 'containers/NewExecution/NewExecution';
import DaoSettings from 'containers/DAOSettings/DAOSettings';

/**
 * TODO: implement codesplitting, especially if api calls
 * are being made by specific pages
 */
// import DAOSettings from 'containers/DAOSettings/DAOSettings';

/**
 * Mainpage taking care of the routing to various dao functions;
 * pulls all the data (for now at least)
 */
const DaoHomePage: React.FC = () => {
  const { daoName } = useParams<any>();
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const { layoutName } = useLayout();

  /**
   * State
   */
  const [daoExists, setDaoExists] = useState<boolean>(true);
  const [IsMoreActions, setIsMoreActions] = useState<boolean>(false);
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
            limit: 100,
            id: dao.queue.id,
          },
        });
      }
    } else {
      setDaoExists(false);
    }
  }, [daoIsLoading, dao, getQueueData]);

  /**
   * Update visible proposals & Check Is more visible actions available
   */
  useEffect(() => {
    if (queueData) {
      setQueueNonce(parseInt(queueData.governQueue.nonce));
      setVisibleActions(queueData.governQueue.containers);
    }
  }, [queueData]);

  useEffect(() => {
    if (queueNonce && visibleActions.length) {
      setIsMoreActions(queueNonce !== visibleActions.length);
    } else setIsMoreActions(false);
  }, [queueNonce, visibleActions]);

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

  /**
   * No Dao found based on the dao name
   * TODO: remove comment!
   */
  if (!daoExists) {
    return <NoDaoFound />;
  }

  /**
   * Dao IS found!
   */
  return (
    <Grid layout={true}>
      <GridItem gridColumn={layoutName === 'small' ? '1/-1' : '1/5'}>
        <DaoSideCard
          address={dao?.queue?.address}
          baseUrl={url}
          identifier={daoName}
          openActions="2"
        />
      </GridItem>
      <GridItem
        gridRow={layoutName === 'small' ? '2/4' : '1'}
        gridColumn={layoutName === 'small' ? '1/-1' : '5/17'}
      >
        <Switch>
          {/* TODO: Note that this 'home' route is not being tracked (ApmRoute not used)
           Should be removed*/}
          <Redirect exact from={path} to={`${path}actions`} />
          <ApmRoute
            exact
            path={`${path}actions`}
            render={() => (
              <DaoActionsPage
                fetchMore={fetchMoreData}
                actions={visibleActions}
                isMore={IsMoreActions}
                identifier={daoName}
              />
            )}
          />
          <ApmRoute
            exact
            path={`${path}finance`}
            render={() => <div>Finance Component goes here...</div>}
          />
          <ApmRoute exact path={`${path}settings`} render={() => <DaoSettings />} />
          <ApmRoute exact path={`${path}actions/new-execution`} render={() => <NewExecution />} />

          {/* Operation not found on DAO */}
          <ApmRoute render={() => <div>Operation not found on dao. Go home?</div>} />
        </Switch>
      </GridItem>
      <GridItem gridColumn={layoutName === 'small' ? '1/-1' : '1/5'}>
        {pathname === `${url}/settings` && <HelpComponent />}
      </GridItem>
    </Grid>
  );
};

export default DaoHomePage;
