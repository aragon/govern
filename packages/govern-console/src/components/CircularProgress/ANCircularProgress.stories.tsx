import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { ANCircularProgress, ANCircularProgressProps } from './ANCircularProgress';

export default {
  title: 'AN-Circularprogress',
  component: ANCircularProgress,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ANCircularProgressProps> = (args) => <ANCircularProgress {...args} />;

export const an_Circularprogress = Template.bind({});

an_Circularprogress.args = {
  status: 1, // or import CiruclarProgressStatus enum
};
