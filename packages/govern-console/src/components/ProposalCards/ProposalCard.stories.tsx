import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { ProposalCard, ProposalCardProps } from './ProposalCard';

export default {
  title: 'AN-ProposalCard',
  component: ProposalCard,
  argTypes: {},
} as Meta;

const Template: Story<ProposalCardProps> = (args) => <ProposalCard {...args} />;

export const Scheduled = Template.bind({});
Scheduled.args = {
  transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
  proposalStatus: 'scheduled',
  proposalDate: '23/01/2021',
};

export const Executed = Template.bind({});
Executed.args = {
  transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
  proposalStatus: 'executed',
  proposalDate: '23/01/2021',
};
