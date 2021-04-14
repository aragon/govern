import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { AddActionsModal, AddActionsModalProps } from './AddActionsModal';

export default {
  title: 'AN-NewActionModal',
  component: AddActionsModal,
  argTypes: {
    labelColor: { control: 'green' },
  },
} as Meta;

const Template: Story<AddActionsModalProps> = (args) => (
  <AddActionsModal {...args} />
);

export const AddActionsModalExample = Template.bind({});
AddActionsModalExample.args = {
  open: true,
  onCloseModal: () => {
    console.log('xyz');
  },
  actions: [
    {
      name: 'Action 1',
    },
    {
      name: 'Action 1',
    },
    {
      name: 'Action 1',
    },
    {
      name: 'Action 1',
    },
  ],
};
