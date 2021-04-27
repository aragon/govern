/* eslint-disable */
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { DaoHeader, DaoHeaderProps } from './DaoHeader';

export default {
  title: 'AN-DaoHeader',
  component: DaoHeader,
  argTypes: {},
} as Meta;

const Template: Story<DaoHeaderProps> = (args) => <DaoHeader {...args} />;

export const ANDaoHeader = Template.bind({});
ANDaoHeader.args = {
  daoName: 'Aaragon Dao',
  usdBalance: 59346,
  ethBalance: 15.091,
};
