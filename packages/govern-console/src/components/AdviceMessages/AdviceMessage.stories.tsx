import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { AdviceMessage, AdviceMessageProps } from './AdviceMessage';

export default {
  title: 'AN-Message-Card',
  component: AdviceMessage,
  argTypes: {
    cardColor: { control: 'green' },
  },
} as Meta;

const Template: Story<AdviceMessageProps> = (args) => (
  <AdviceMessage {...args} />
);

export const Green = Template.bind({});
Green.args = {
  cardColor: 'green',
  messageText:
    'Everyone thinks that they are a Rick when they actually are a Jerry. Beth might be a robot and Rick must have forgot if she is his actual daughter or a robot that he made to take her place.',
};
export const Orange = Template.bind({});
Orange.args = {
  cardColor: 'orange',
  messageText:
    'Everyone thinks that they are a Rick when they actually are a Jerry. Beth might be a robot and Rick must have forgot if she is his actual daughter or a robot that he made to take her place.',
};
export const Blue = Template.bind({});
Blue.args = {
  cardColor: 'blue',
  messageText:
    'Everyone thinks that they are a Rick when they actually are a Jerry. Beth might be a robot and Rick must have forgot if she is his actual daughter or a robot that he made to take her place.',
};
export const Grey = Template.bind({});
Grey.args = {
  cardColor: 'grey',
  messageText:
    'Everyone thinks that they are a Rick when they actually are a Jerry. Beth might be a robot and Rick must have forgot if she is his actual daughter or a robot that he made to take her place.',
};
