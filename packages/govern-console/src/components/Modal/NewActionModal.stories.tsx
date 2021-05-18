import React from 'react';
import { Story, Meta } from '@storybook/react';
import { NewActionModal, NewActionModalProps } from './NewActionModal';

export default {
  title: 'AN-NewActionModal',
  component: NewActionModal,
  argTypes: {
    labelColor: { control: 'green' },
  },
} as Meta;

const Template: Story<NewActionModalProps> = (args) => <NewActionModal {...args} />;

export const NewActionModalExample = Template.bind({});
NewActionModalExample.args = {
  open: true,
  onCloseModal: () => {
    console.log('xyz');
  },
};
