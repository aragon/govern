import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { ANButton, ANButtonProps } from './ANButton';

export default {
  title: 'ANButton',
  component: ANButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ANButtonProps> = (args) => <ANButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  label: 'New proposal',
  disabled: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  label: 'Cancel',
};

export const Challenge = Template.bind({});
Challenge.args = {
  type: 'challenge',
  label: 'Challenge',
};
