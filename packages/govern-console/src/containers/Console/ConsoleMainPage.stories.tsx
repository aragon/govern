import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { Story, Meta } from '@storybook/react';

import { ConsoleMainPageProps, ConsoleMainPage } from './ConsoleMainPage';

export default {
  title: 'Console Main Page',
  component: ConsoleMainPage,
  argTypes: {},
} as Meta;

const Template: Story<ConsoleMainPageProps> = (args) => (
  <ConsoleMainPage {...args} />
);
const daoList = [
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
  {
    name: 'Aragon',
    aumValue: '540.3',
    numberOfProposals: 43,
    daoId: 1,
  },
];

export const ANDaoCard = Template.bind({});
ANDaoCard.args = {
  daoList,
};
