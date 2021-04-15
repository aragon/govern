import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { AddressIdentifier, AddressIdentifierProps } from './AddressIdentifier';

export default {
  title: 'AN-AddressIdentifier',
  component: AddressIdentifier,
  argTypes: {
    labelColor: { control: 'green' },
  },
} as Meta;

const Template: Story<AddressIdentifierProps> = (args) => (
  <AddressIdentifier {...args} />
);

export const AddressSmall = Template.bind({});
AddressSmall.args = {
  componentSize: 'small',
  displayText: '0xe3cF69b86F274a14B87946bf641f11Ac837f4492',
  isAddress: true,
};

export const AddressNormal = Template.bind({});
AddressNormal.args = {
  componentSize: 'medium',
  displayText: '0xe3cF69b86F274a14B87946bf641f11Ac837f4492',
  isAddress: true,
};

export const NameSmall = Template.bind({});
NameSmall.args = {
  componentSize: 'small',
  displayText: 'Raul Alvarez',
  isAddress: false,
};

export const NameNormal = Template.bind({});
NameNormal.args = {
  componentSize: 'medium',
  displayText: 'Raul Alvarez',
  isAddress: false,
};
