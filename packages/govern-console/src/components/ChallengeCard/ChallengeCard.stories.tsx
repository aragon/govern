import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ChallengeCard, ChallengeCardProps } from './ChallengeCard';

export default {
  title: 'Challenge-Card',
  component: ChallengeCard,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ChallengeCardProps> = (args) => <ChallengeCard {...args} />;

export const ChallengeCardSimple = Template.bind({});
ChallengeCardSimple.args = {
  challengeButtonFunction: () => console.log('Some Function should be passed here'),
  setIpfsHash: (value: string) => console.log('Value to set', value),
};
