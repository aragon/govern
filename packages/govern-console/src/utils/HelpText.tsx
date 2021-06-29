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
};
