import React from 'react';
import NewDAOContainer from './CreateDAO';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'New_DAO_Container',
  component: NewDAOContainer,
} as Meta;

const Template: Story = () => <NewDAOContainer />;
export const newDaoContainer = Template.bind({});
