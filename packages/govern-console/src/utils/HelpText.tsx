import { ReactNode } from 'react';

export enum PageName {
  NEW_EXECUTION = 'NEW_EXECUTION',
  CREATE_DAO = 'CREATE_DAO',
}

export const HelpText: Record<string, Array<ReactNode>> = {
  [PageName.NEW_EXECUTION]: [
    [
      "What's an execution?",
      'Lorem ipsum dolor amet ipsum amet dolores ipsum amet dolores ipsum dolor amet ipsum amet amet dolores ipsum amet dolores ipsum amet.',
    ],
    [
      'What is an action?',
      'Lorem ipsum dolor amet ipsum amet dolores ipsum amet dolores ipsum dolor amet ipsum amet amet dolores ipsum amet dolores ipsum amet.',
    ],
    [
      'Why include a justification?',
      'Lorem ipsum dolor amet ipsum amet dolores ipsum amet dolores ipsum dolor amet ipsum amet amet dolores ipsum amet dolores ipsum amet.',
    ],
    [
      'What is an ABI function?',
      'Lorem ipsum dolor amet ipsum amet dolores ipsum amet dolores ipsum dolor amet ipsum amet amet dolores ipsum amet dolores ipsum amet.',
    ],
  ],
  [PageName.CREATE_DAO]: [
    [
      'What’s a DAO?',
      <div key={'acordion-item-0'} style={{ padding: 20 }}>
        There is no central leadership, decisions are made in a bottom-up way. The idea takes on a
        life of its own, and it’s able to incentivize others to make itself happen. It can have its
        own rules, such as how to manage its own funds.
      </div>,
    ],
    [
      'Is a DAO free?',
      <div key={'acordion-item-1'} style={{ padding: 20 }}>
        somthing about Is a DAO free?
      </div>,
    ],
    [
      'What I can do with my DAO',
      <div key={'acordion-item-2'} style={{ padding: 20 }}>
        somthing about Is a DAO free?
      </div>,
    ],
  ],
};
