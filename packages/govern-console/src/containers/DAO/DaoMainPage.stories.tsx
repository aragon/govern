import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { DaoMainPage, DaoMainPageProps } from './DaoMainPage';

export default {
  title: 'AN-DaoMainPage',
  component: DaoMainPage,
  argTypes: {},
} as Meta;

const Template: Story<DaoMainPageProps> = (args) => <DaoMainPage {...args} />;
const proposalList = [
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'scheduled',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'executed',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'scheduled',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'executed',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'scheduled',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'executed',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'scheduled',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'executed',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'scheduled',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'executed',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'scheduled',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'executed',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'scheduled',
    proposalDate: '23/01/2021',
  },
  {
    transactionHash: '0x833bc6779e615b491e82c68ebc43d1a2af519b95d21ef1a3a81c8d8cfd35ca42',
    proposalStatus: 'executed',
    proposalDate: '23/01/2021',
  },
];

export const ANDaoMainPage = Template.bind({});
ANDaoMainPage.args = {
  daoName: 'Aragon Dao',
  usdBalance: 562912,
  ethBalance: 120.91,
  // isProfile: false,
  proposalList,
};
