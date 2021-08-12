import { ReactNode } from 'react';
import { Link } from '@aragon/ui';

export enum PageName {
  NEW_EXECUTION = 'NEW_EXECUTION',
  CREATE_DAO = 'CREATE_DAO',
  CREATE_DAO_CONFIG = 'CREATE_DAO_CONFIG',
  CREATE_DAO_COLLATERAL = 'CREATE_DAO_COLLATERAL',
}

const TRANSACTION_TIP = (index: number) => [
  'What is a transaction?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    A transaction is any movement of funds within or from your DAO or any change of settings.
  </div>,
];

const REASONS_TIP = (index: number) => [
  'Why do I need to justify when scheduling a transaction?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    DAO members may challenge any transaction contrary to the DAO Agreement. Therefore, you must
    explain how this transaction is compatible with the Agreement.
  </div>,
];

const WHATS_DAO_TIP = (index: number) => [
  'What’s a DAO?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    A DAO is a self-organizing online community that uses distributed ledger technology (DLT) like
    Ethereum to manage its funds securely. You can read more about them{' '}
    <Link href="https://aragon.org/dao">here</Link>.
  </div>,
];

const DAO_FREE_TIP = (index: number) => [
  'Is a DAO free?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    DAOs are permissionless, meaning anyone can set one up, but operations on the DL such as
    creating the DAO or sending transactions do incur a 'gas' fee.
  </div>,
];

const WHAT_TO_DO_DAO_TIP = (index: number) => [
  'What can I do with my DAO?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    Build any organization you can dream of!{' '}
    <Link href="https://blog.aragon.org/15-ways-the-world-is-being-transformed-by-daos/">
      Here are a few ideas
    </Link>
    .
  </div>,
];

const EXECUTION_DELAY_TIP = (index: number) => [
  'What is execution delay?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    The execution delay is the minimum time any transaction that is scheduled in your DAO can’t be
    executed. This delay enables members to make sure the transaction is valid and conforms to your
    agreement, and if not, can be disputed. After this cool down period, transaction will be
    available for execution.
  </div>,
];

const COLLATERALS_TIP = (index: number) => [
  'Why do I need to define collaterals?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    Collaterals on Govern DAOs are used to make sure members are cautious with their actions. If a
    transaction is disputed, both the transaction creator and the challenger will be staking their
    collaterals into a dispute, and can lose it if the dispute is ruled in favor of the other.
  </div>,
];

const ADDRESS_LIST_TIP = (index: number) => [
  'What is the address whitelist?',
  <div key={`acordion-item-${index}`} style={{ padding: 16 }}>
    Aragon Govern enables decisions to be made faster, as long as members hold the collateral
    tokens. If you want to add an extra layer of security you can also create a list of addresses
    that are allowed to schedule transaction, so not only members need to hold the tokens, but also
    be in this list.
  </div>,
];

export const HelpText: Record<string, Array<ReactNode>> = {
  [PageName.NEW_EXECUTION]: [TRANSACTION_TIP(0), REASONS_TIP(1)],
  [PageName.CREATE_DAO]: [WHATS_DAO_TIP(0), DAO_FREE_TIP(1), WHAT_TO_DO_DAO_TIP(2)],
  [PageName.CREATE_DAO_CONFIG]: [WHATS_DAO_TIP(0), EXECUTION_DELAY_TIP(0)],
  [PageName.CREATE_DAO_COLLATERAL]: [WHATS_DAO_TIP(0), COLLATERALS_TIP(0), ADDRESS_LIST_TIP(1)],
};
