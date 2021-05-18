import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react';
import SnackBarProvider from '../../customProviders/snackbarProvider';
import ConsoleMainPage from './ConsoleMainPage';

export default {
  title: 'Console Main Page',
  component: ConsoleMainPage,
  argTypes: {},
} as Meta;

const Template: Story = () => {
  return (
    <SnackBarProvider>
      <ConsoleMainPage />
    </SnackBarProvider>
  );
};

export const ANDaoCard = Template.bind({});
