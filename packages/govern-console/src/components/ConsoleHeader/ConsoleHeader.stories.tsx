import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react';
import { ConsoleHeader } from './ConsoleHeader';
import SnackBarProvider from '../../customProviders/snackbarProvider';

export default {
  title: 'AN-ConsoleHeader',
  component: ConsoleHeader,
  argTypes: {},
} as Meta;

const Template: Story = () => {
  return (
    <SnackBarProvider>
      <ConsoleHeader />
    </SnackBarProvider>
  );
};

export const ANConsoleHeader = Template.bind({});
ANConsoleHeader.args = {};
