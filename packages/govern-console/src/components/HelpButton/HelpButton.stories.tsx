import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { HelpButton, HelpButtonProps } from './HelpButton';

export default {
  title: 'HelpButton',
  component: HelpButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<HelpButtonProps> = (args) => <HelpButton {...args} />;

export const HelpBtn = Template.bind({});
HelpBtn.args = {
  helpText:
    'Question: as the result of the originating action being challenged. When the challenge is resolved?',
};
