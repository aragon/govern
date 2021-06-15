enum CreateDaoSteps {
  BasicInfo,
  Config,
  Collateral,
  Review,
  Progress,
}

const accordionItems = [
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
];

const stepsNames = ['Basic info', 'Config', 'Collateral', 'Review'];

const formatParamNames: { [key: string]: string } = {
  daoIdentifier: 'Dao Identifier',
  isExistingToken: 'Use Existing Token',
  tokenName: 'Token Name',
  tokenSymbol: 'Token Symbol',
  tokenAddress: 'Token Address',
  tokenMintAmount: 'Token Mint Amount',
  isProxy: 'Use Proxy',

  executionDelay: 'Execution Delay',
  isRuleFile: 'Use Rule File',
  ruleFile: 'Rule File',
  ruleText: 'Rule Text',
  resolver: 'Resolver',
  maxCalldataSize: 'Max Call Data Size',

  scheduleAddress: 'Schedule Address',
  scheduleAmount: 'Schedule Amount',
  isScheduleNewDaoToken: 'Use Schedule New Dao Token',
  challengeAddress: 'Challenge Address',
  challengeAmount: 'Challenge Amount',
  isChallengeNewDaoToken: 'Use Challenge New Dao Token',
  isAnyAddress: 'Use Any Address',
  executionAddressList: 'Excutors Addresses',
};

export type BasicInfoIndexType =
  | 'daoIdentifier'
  | 'isExistingToken'
  | 'tokenName'
  | 'tokenSymbol'
  | 'tokenAddress'
  | 'tokenMintAmount'
  | 'isProxy';

export type ConfigIndexType =
  | 'executionDelay'
  | 'isRuleFile'
  | 'ruleFile'
  | 'ruleText'
  | 'resolver';

export type CollateralsIndexType =
  | 'scheduleAddress'
  | 'scheduleAmount'
  | 'isScheduleNewDaoToken'
  | 'challengeAddress'
  | 'challengeAmount'
  | 'isChallengeNewDaoToken'
  | 'isAnyAddress'
  | 'executionAddressList';

export { accordionItems, stepsNames, formatParamNames, CreateDaoSteps };
