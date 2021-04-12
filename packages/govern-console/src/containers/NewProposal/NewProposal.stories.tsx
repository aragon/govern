import React from 'react';
import NewProposal, { NewProposalProps } from './NewProposal';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'NewProposal',
  component: NewProposal,
} as Meta;

const Template: Story<NewProposalProps> = (args) => <NewProposal {...args} />;
export const NewProposalComponent = Template.bind({});
