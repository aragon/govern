import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { Dropdown } from './Dropdown';

export default {
  title: 'AN-Dropdown',
  component: Dropdown,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story = (args) => <Dropdown {...args} />;

export const DropdownExample = Template.bind({});
DropdownExample.args = {
  type: 'primary',
  label: 'New proposal',
  disabled: true,
};
