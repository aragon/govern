import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

/* eslint-disable */
import { Story, Meta } from '@storybook/react';
import { ModalProps } from '@material-ui/core/Modal';
import { SimpleModal, SimpleModalProps } from './SimpleModal';

export default {
  title: 'SimpleModal',
  component: SimpleModal,
  argTypes: {
    labelColor: { control: 'green' },
  },
} as Meta;

const Template: Story<SimpleModalProps> = (args) => <SimpleModal {...args} />;

export const simple_emptyModal = Template.bind({});
simple_emptyModal.args = {
  open: true,
  onClose: () => {
    console.log('xyz');
  },
  children: <div>'Some content...'</div>,
  modalTitle: <div style={{ width: 300 }}>Some Title</div>,
};
