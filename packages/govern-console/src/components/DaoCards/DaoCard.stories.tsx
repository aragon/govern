import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { DaoCard, DaoCardProps } from './DaoCard';

export default {
  title: 'AN-DaoCard',
  component: DaoCard,
  argTypes: {},
} as Meta;

const Template: Story<DaoCardProps> = (args) => <DaoCard {...args} />;

export const ANDaoCard = Template.bind({});
ANDaoCard.args = {
  label: 'Aaragon Dao',
  aumValue: 100.4,
  numberOfProposals: 453,
};
