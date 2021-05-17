import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { BlueCheckbox } from './BlueCheckbox';

export default {
  title: 'Blue-checkbox',
  component: BlueCheckbox,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story = (args) => <BlueCheckbox {...args} />;

export const blue_checkbox = Template.bind({});
