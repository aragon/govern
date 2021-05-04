/* eslint-disable */
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { InputField, InputFieldProps } from './InputField';

export default {
  title: 'AN-TextField',
  component: InputField,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<InputFieldProps> = (args) => {
  const [value, setValue] = React.useState<string>('');
  return (
    <InputField
      onInputChange={(updatedValue) => setValue(updatedValue)}
      value={value}
      {...args}
    />
  );
};
export const InputFieldExample = Template.bind({});
InputFieldExample.args = {
  type: 'primary',
  label: 'New proposal',
};

export const InputFieldExample_Error = Template.bind({});
InputFieldExample_Error.args = {
  type: 'primary',
  label: 'New proposal',
  error: true,
  helperText: 'Some error message',
};
