import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { Label, LabelProps } from './Label';

export default {
  title: 'AN-Label',
  component: Label,
  argTypes: {
    labelColor: { control: 'green' },
  },
} as Meta;

const Template: Story<LabelProps> = (args) => <Label {...args} />;

export const Green = Template.bind({});
Green.args = {
  labelColor: 'green',
  labelText: 'Aaragon',
};

export const White = Template.bind({});
White.args = {
  labelColor: 'white',
  labelText: 'Aaragon',
};

export const Orange = Template.bind({});
Orange.args = {
  labelColor: 'orange',
  labelText: 'Aaragon',
};

export const Red = Template.bind({});
Red.args = {
  labelColor: 'red',
  labelText: 'Aaragon',
};

export const Yellow = Template.bind({});
Yellow.args = {
  labelColor: 'yellow',
  labelText: 'Aaragon',
};

export const Grey = Template.bind({});
Grey.args = {
  labelColor: 'grey',
  labelText: 'Aaragon',
};
