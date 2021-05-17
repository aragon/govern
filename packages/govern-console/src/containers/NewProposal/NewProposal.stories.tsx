import React from 'react';
import NewProposal, { NewProposalProps } from './NewProposal';
import { Story, Meta } from '@storybook/react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import SnackBarProvider from '../../customProviders/snackbarProvider';

export default {
  title: 'NewProposal',
  component: NewProposal,
} as Meta;

const Template: Story<NewProposalProps> = (args) => {
  return (
    <SnackBarProvider>
      <Router initialEntries={['/daos/Loo5']}>
        <Route exact path="/daos/:daoName">
          <NewProposal {...args} />
        </Route>
      </Router>
    </SnackBarProvider>
  );
};
export const NewProposalComponent = Template.bind({});
