/* eslint-disable */
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { BlueProgressBar } from './BlueProgressBar';
import { LinearProgressProps } from '@material-ui/core/LinearProgress';

export default {
  title: 'Blue-progressBar',
  component: BlueProgressBar,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<LinearProgressProps> = (args) => <BlueProgressBar {...args} />;

export const blue_progress_bar = Template.bind({});

blue_progress_bar.args = {
  value: 50,
};
