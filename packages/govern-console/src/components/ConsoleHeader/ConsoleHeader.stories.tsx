import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { ConsoleHeader, ConsoleHeaderProps } from './ConsoleHeader';

export default {
  title: 'AN-ConsoleHeader',
  component: ConsoleHeader,
  argTypes: {},
} as Meta;

const Template: Story<ConsoleHeaderProps> = (args) => <ConsoleHeader {...args} />;

export const ANConsoleHeader = Template.bind({});
ANConsoleHeader.args = {};
