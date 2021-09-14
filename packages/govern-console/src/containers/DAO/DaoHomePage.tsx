import { ApmRoute } from '@elastic/apm-rum-react';
import { Grid, GridItem, useLayout } from '@aragon/ui';
import { Redirect, Switch, useParams, useRouteMatch } from 'react-router';

import DaoSideCard from './components/DaoSideCard/DaoSideCard';

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
  const { path, url } = useRouteMatch();
  const { layoutName } = useLayout();

  /**
   * TODO: Check if dao is found, setup sub routing with actions;
   * Return daoNotFound.
   */
  return (
    <Grid layout={true}>
      <GridItem gridColumn={layoutName === 'small' ? '1/-1' : '1/5'}>
        <DaoSideCard baseUrl={url} identifier={daoName} openActions="2" />
      </GridItem>
      <GridItem
        gridRow={layoutName === 'small' ? '2/4' : '1'}
        gridColumn={layoutName === 'small' ? '1/-1' : '5/17'}
      >
        <Switch>
          {/* Note that this 'home' route is not being tracked (ApmRoute not used)*/}
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
          <ApmRoute
            exact
            path={`${path}settings`}
            render={() => <div>Settings Component goes here...</div>}
          />

          {/* Need to vault upwards into parent 404 */}
          <ApmRoute render={() => <div>TEMP not found component</div>} />
        </Switch>
      </GridItem>
    </Grid>
  );
};

export default DaoHomePage;
