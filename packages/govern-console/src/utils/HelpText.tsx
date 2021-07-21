import { ReactNode } from 'react';
import { Link } from '@aragon/ui';

export enum PageName {
  NEW_EXECUTION = 'NEW_EXECUTION',
  CREATE_DAO = 'CREATE_DAO',
}

export const HelpText: Record<string, Array<ReactNode>> = {
  [PageName.NEW_EXECUTION]: [
    [
      'What is a transaction?',
      <div key={'acordion-item-0'} style={{ padding: 16 }}>
        A transaction is any movement of funds within or from your DAO or any change of settings.
      </div>,
    ],
    [
      'Why do I need to write the reasons for changing the DAO settings?',
      <div key={'acordion-item-1'} style={{ padding: 16 }}>
        DAO members may challenge any transaction contrary to the DAO Agreement in Aragon Court.
        Therefore, you must explain how the change is compatible with the Agreement.
      </div>,
    ],
  ],
  [PageName.CREATE_DAO]: [
    [
      'What’s a DAO?',
      <div key={'acordion-item-0'} style={{ padding: 16 }}>
        A DAO is a self-organizing online community that uses distributed ledger technology (DLT)
        like Ethereum to manage its funds securely. You can read more about them{' '}
        <Link href="https://aragon.org/dao">here</Link>.
      </div>,
    ],
    [
      'Is a DAO free?',
      <div key={'acordion-item-1'} style={{ padding: 16 }}>
        DAOs are permissionless, meaning anyone can set one up, but operations on the DL such as
        creating the DAO or sending transactions do incur a 'gas' fee.
      </div>,
    ],
    [
      'What can I do with my DAO?',
      <div key={'acordion-item-2'} style={{ padding: 16 }}>
        Build any organization you can dream of!{' '}
        <Link href="https://blog.aragon.org/15-ways-the-world-is-being-transformed-by-daos/">
          Here are a few ideas
        </Link>
        .
      </div>,
    ],
  ],
};
