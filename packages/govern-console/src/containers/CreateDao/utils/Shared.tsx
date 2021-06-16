import {
  ICreateDaoBasicInfo,
  ICreateDaoConfig,
  ICreateDaoCollaterals,
} from './CreateDaoContextProvider';

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

export type BasicInfoArg =
  | 'daoIdentifier'
  | 'isExistingToken'
  | 'tokenName'
  | 'tokenSymbol'
  | 'tokenDecimals'
  | 'tokenAddress'
  | 'tokenMintAmount'
  | 'isProxy';

export type ConfigArgs = 'executionDelay' | 'isRuleFile' | 'ruleFile' | 'ruleText' | 'resolver';

export type CollateralsArgs =
  | 'scheduleAddress'
  | 'scheduleAmount'
  | 'isScheduleNewDaoToken'
  | 'challengeAddress'
  | 'challengeAmount'
  | 'isChallengeNewDaoToken'
  | 'isAnyAddress'
  | 'executionAddressList';

const basicInfoArray = (basicInfo: ICreateDaoBasicInfo) => {
  const filters: (keyof ICreateDaoBasicInfo)[] = basicInfo.isExistingToken
    ? ['tokenDecimals', 'isExistingToken', 'tokenName', 'tokenSymbol', 'tokenMintAmount']
    : ['tokenDecimals', 'isExistingToken', 'tokenAddress'];

  return Object.entries(basicInfo)
    .filter((entry) => !filters.includes(entry[0] as any))
    .map((entry) => ({
      name: formatParamNames[entry[0]?.toString()],
      value: entry[1]?.toString(),
    }));
};

const configArray = (config: ICreateDaoConfig) => {
  const formatValue = (name: string, value: any) => {
    switch (name) {
      case 'ruleFile':
        return value[0].name;

      default:
        return value.toString();
    }
  };

  const filters: (keyof ICreateDaoConfig)[] = !config.isRuleFile
    ? ['maxCalldataSize', 'isRuleFile', 'ruleFile']
    : ['maxCalldataSize', 'isRuleFile', 'ruleText'];

  return Object.entries(config)
    .filter((entry) => !filters.includes(entry[0] as any))
    .map((entry) => ({
      name: formatParamNames[entry[0]?.toString()],
      value: formatValue(entry[0], entry[1]),
    }));
};

const collateralArray = (collaterals: ICreateDaoCollaterals) => {
  const formatValue = (name: string, value: any) => {
    if (
      (name === 'scheduleAddress' && collaterals.isScheduleNewDaoToken) ||
      (name === 'challengeAddress' && collaterals.isChallengeNewDaoToken)
    )
      return 'The contract address will be available after the creation process';
    return value;
  };

  const filters: (keyof ICreateDaoCollaterals)[] = collaterals.isAnyAddress
    ? ['scheduleDecimals', 'challengeDecimals', 'executionAddressList']
    : ['scheduleDecimals', 'challengeDecimals'];

  return Object.entries(collaterals)
    .filter((entry) => !filters.includes(entry[0] as any))
    .map((entry) => ({
      name: formatParamNames[entry[0]?.toString()],
      value: formatValue(entry[0], entry[1]?.toString()),
    }));
};

export {
  accordionItems,
  stepsNames,
  formatParamNames,
  CreateDaoSteps,
  basicInfoArray,
  collateralArray,
  configArray,
};
