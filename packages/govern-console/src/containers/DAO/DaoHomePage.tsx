import { ApmRoute } from '@elastic/apm-rum-react';
import { Redirect, Switch, useRouteMatch } from 'react-router';

import DaoSideCard from './components/DaoSideCard/DaoSideCard';
import DaoSettings from 'containers/DAOSettings/DAOSettings';

const DaoHomePage: React.FC = () => {
  const { path, url } = useRouteMatch();

  /**
   * Check iff dao is found, setup sub routing with actions;
   * Return daoNotFound
   */
  return (
    <>
      <div>New Home Page</div>
      <DaoSideCard baseUrl={url} />
      <Switch>
        <Redirect exact from={path} to={`${path}actions`} />
        <ApmRoute path={`${path}actions`} render={() => <div>Actions</div>} />
        <ApmRoute path={`${path}finance`} render={() => <div>Finance</div>} />
        <ApmRoute path={`${path}settings`} render={() => <DaoSettings />} />
        {/* TODO: Action not found, send user to dao maybe? */}
      </Switch>
    </>
  );
};

export default DaoHomePage;
