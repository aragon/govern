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

      case 'ruleText':
        return value && typeof value !== 'string' ? toUtf8String(value) : value;

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
      return 'The contract address will be available after the creation process';

    if (
      name === 'isScheduleNewDaoToken' ||
      name === 'isChallengeNewDaoToken' ||
      name === 'isAnyAddress'
    )
      return Boolean(value).toString();

    return value;
  };

  const filters: (keyof ICreateDaoCollaterals)[] = collaterals.isAnyAddress
    ? ['scheduleDecimals', 'challengeDecimals', 'executionAddressList']
    : ['scheduleDecimals', 'challengeDecimals', 'isAnyAddress'];

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
