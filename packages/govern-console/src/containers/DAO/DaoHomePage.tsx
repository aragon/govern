import { ApmRoute } from '@elastic/apm-rum-react';
import { Main } from '@aragon/ui';
import { Redirect, Switch, useParams, useRouteMatch } from 'react-router';

import DaoSideCard from './components/DaoSideCard/DaoSideCard';

const DaoHomePage: React.FC = () => {
  const { daoName } = useParams<any>();
  const { path, url } = useRouteMatch();

  /**
   * Check iff dao is found, setup sub routing with actions;
   * Return daoNotFound
   */
  return (
    <Main>
      <DaoSideCard baseUrl={url} identifier={daoName} openActions="2" />
      <Switch>
        <Redirect exact from={path} to={`${path}actions`} />
        <ApmRoute path={`${path}actions`} render={() => <div>Actions</div>} />
        <ApmRoute path={`${path}finance`} render={() => <div>Finance</div>} />
        <ApmRoute path={`${path}settings`} render={() => <div>Settings</div>} />
        {/* TODO: Action not found, send user to dao maybe? */}
      </Switch>
    </Main>
  );
};

export default DaoHomePage;
