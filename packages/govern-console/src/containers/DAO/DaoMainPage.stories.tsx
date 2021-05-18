import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import DaoMainPage from './DaoMainPage';

export default {
  title: 'AN-DaoMainPage',
  component: DaoMainPage,
  argTypes: {},
} as Meta;

const Template: Story = () => {
  return (
    <Router initialEntries={['/daos/Loo5']}>
      <Route exact path="/daos/:daoName">
        <DaoMainPage />
      </Route>
    </Router>
  );
};

export const ANDaoMainPage = Template.bind({});
ANDaoMainPage.args = {};
