import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { BlueSwitch, BlueSwitchProps } from './BlueSwitch';

export default {
  title: 'Blue-Switch',
  component: BlueSwitch,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<BlueSwitchProps> = (args) => <BlueSwitch {...args} />;

export const Blue_Switch = Template.bind({});

Blue_Switch.args = {
  disabled: true,
};
