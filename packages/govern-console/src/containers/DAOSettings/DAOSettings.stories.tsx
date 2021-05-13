/* eslint-disable */
import React from 'react';
import DAOSetting from './DAOSettings';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'DAO_Setting_Container',
  component: DAOSetting,
} as Meta;

const Template: Story = () => (
  <DAOSetting onClickBack={() => console.log('goBack function should be passed')} />
);
export const Dao_Setting_Container = Template.bind({});
