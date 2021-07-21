import { toUtf8String } from 'ethers/lib/utils';
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

const stepsNames = ['Basic info', 'Config', 'Collaterals', 'Review'];

const formatParamNames: { [key: string]: string } = {
  daoIdentifier: 'DAO Identifier',
  isExistingToken: 'Use Existing Token',
  tokenName: 'Token Name',
  tokenSymbol: 'Token Symbol',
  tokenAddress: 'Token Address',
  tokenMintAmount: 'Token Mint Amount',
  isProxy: 'Use Proxy',

  executionDelay: 'Execution Delay',
  isRuleFile: 'Use Rule File',
  ruleFile: 'DAO Agreement',
  ruleText: 'DAO Agreement',
  resolver: 'Dispute resolution client',
  maxCalldataSize: 'Max Call Data Size',

  scheduleAddress: 'Schedule Token Address',
  scheduleAmount: 'Schedule Token Amount',
  isScheduleNewDaoToken: 'Use Schedule New Dao Token',
  challengeAddress: 'Challenge Token Address',
  challengeAmount: 'Challenge Token Amount',
  isChallengeNewDaoToken: 'Use Challenge New Dao Token',
  isAnyAddress: 'Scheduling transaction whitelist',
  executionAddressList: 'Scheduling transaction whitelist',
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

  const formatValue = (name: string, value: any) => {
    switch (name) {
      case 'isProxy':
        return value ? 'Yes' : 'No';

      default:
        return value.toString();
    }
  };

  return Object.entries(basicInfo)
    .filter((entry) => !filters.includes(entry[0] as any))
    .map((entry) => ({
      name: formatParamNames[entry[0]?.toString()],
      value: formatValue(entry[0], entry[1]),
    }));
};

const configArray = (config: ICreateDaoConfig) => {
  const formatValue = (name: string, value: any) => {
    switch (name) {
      case 'ruleFile':
        return value[0].name;

      case 'ruleText':
        return value && typeof value !== 'string' ? toUtf8String(value) : value;

      case 'executionDelay':
        return `${value} seconds`;

      default:
        return value.toString();
    }
  };

  const filters: (keyof ICreateDaoConfig)[] = !config.isRuleFile
    ? ['maxCalldataSize', 'customResolver', 'isRuleFile', 'ruleFile']
    : ['maxCalldataSize', 'customResolver', 'isRuleFile', 'ruleText'];

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
      return 'New DAO token';

    if (name === 'isScheduleNewDaoToken' || name === 'isChallengeNewDaoToken')
      return Boolean(value) ? 'Yes' : 'No';

    if (name === 'isAnyAddress') {
      return 'Any Address';
    }

    return value;
  };

  const filters: (keyof ICreateDaoCollaterals)[] = collaterals.isAnyAddress
    ? [
        'scheduleDecimals',
        'challengeDecimals',
        'executionAddressList',
        'isChallengeNewDaoToken',
        'isScheduleNewDaoToken',
      ]
    : [
        'scheduleDecimals',
        'challengeDecimals',
        'isAnyAddress',
        'isChallengeNewDaoToken',
        'isScheduleNewDaoToken',
      ];

  return Object.entries(collaterals)
    .filter((entry) => !filters.includes(entry[0] as any))
    .map((entry) => ({
      name: formatParamNames[entry[0]?.toString()],
      value: formatValue(entry[0], entry[1]),
    }));
};

export {
  stepsNames,
  formatParamNames,
  CreateDaoSteps,
  basicInfoArray,
  collateralArray,
  configArray,
};
