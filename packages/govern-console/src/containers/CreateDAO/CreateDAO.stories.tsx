import React from 'react';
import CreateDao from './CreateDao';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'New_DAO_Container',
  component: CreateDao,
} as Meta;

const Template: Story = () => <CreateDao />;
export const newDaoContainer = Template.bind({});
