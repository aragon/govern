import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { InputField } from './InputField';

export default {
  title: 'AN-TextField',
  component: InputField,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story = (args) => <InputField {...args} />;

export const InputFieldExample = Template.bind({});
InputFieldExample.args = {
  type: 'primary',
  label: 'New proposal',
  disabled: true,
};
