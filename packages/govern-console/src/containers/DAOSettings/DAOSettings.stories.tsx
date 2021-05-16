import React from 'react';
import DAOSetting from './DAOSettings';
import { Story, Meta } from '@storybook/react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import SnackBarProvider from '../../customProviders/snackbarProvider';

export default {
  title: 'DAO_Setting_Container',
  component: DAOSetting,
} as Meta;

const Template: Story = () => {
  return (
    <SnackBarProvider>
      <Router initialEntries={['/daos/Loo5']}>
        <Route exact path="/daos/:daoName">
          <DAOSetting />
        </Route>
      </Router>
    </SnackBarProvider>
  );
};
export const Dao_Setting_Container = Template.bind({});
