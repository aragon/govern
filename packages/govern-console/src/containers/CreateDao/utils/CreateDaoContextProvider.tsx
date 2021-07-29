import React, { useMemo, useState, useContext } from 'react';
import { BigNumber, BytesLike } from 'ethers';
import { networkEnvironment } from 'environment';
import { useCallback } from 'react';

export interface ICreateDaoBasicInfo {
  daoIdentifier: string;
  isExistingToken: boolean;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenAddress: string;
  tokenMintAmount: BigNumber | string;
  isProxy: boolean;
}

export interface ICreateDaoConfig {
  executionDelay: number;
  isRuleFile: boolean;
  ruleFile: any;
  ruleText: BytesLike;
  resolver: string;
  maxCalldataSize: number;
  customResolver: boolean; // true if the user has entered new resolver.
}

export interface ICreateDaoCollaterals {
  isScheduleNewDaoToken: number;
  scheduleAddress: string;
  scheduleAmount: BigNumber | string;
  scheduleDecimals: number;
  isChallengeNewDaoToken: number;
  challengeAddress: string;
  challengeAmount: BigNumber | string;
  challengeDecimals: number;
  isAnyAddress: boolean;
  executionAddressList: string[];
}

export interface CreateDaoContext {
  // basic info
  basicInfo: ICreateDaoBasicInfo;
  setBasicInfo: (basicInfo: ICreateDaoBasicInfo) => void;
  // config
  config: ICreateDaoConfig;
  setConfig: (config: ICreateDaoConfig) => void;
  // collaterals
  collaterals: ICreateDaoCollaterals;
  setCollaterals: (collaterals: ICreateDaoCollaterals) => void;

  handleIsExistingToken: (e: any, onChange: (e: any) => void) => void;
}

const UseCreateDao = React.createContext<CreateDaoContext | null>(null);

const CreateDaoProvider: React.FC = ({ children }) => {
  const { defaultDaoConfig: defaultConfig } = networkEnvironment;

  const [basicInfo, setBasicInfo] = useState<ICreateDaoBasicInfo>({
    daoIdentifier: '',
    isExistingToken: false,
    tokenName: '',
    tokenSymbol: '',
    tokenAddress: '',
    tokenDecimals: 18,
    tokenMintAmount: '',
    isProxy: true,
  });

  const [config, setConfig] = useState<ICreateDaoConfig>({
    executionDelay: parseInt(defaultConfig.executionDelay.toString()),
    isRuleFile: false,
    ruleFile: '',
    ruleText: defaultConfig.rules,
    resolver: defaultConfig.resolver,
    maxCalldataSize: defaultConfig.maxCalldataSize,
    customResolver: false,
  });

  const [collaterals, setCollaterals] = useState<ICreateDaoCollaterals>({
    isScheduleNewDaoToken: 0,
    scheduleAddress: defaultConfig.scheduleDeposit.token,
    scheduleAmount: BigNumber.from(defaultConfig.scheduleDeposit.amount),
    scheduleDecimals: 18, // TODO: this should be coming from the config
    isChallengeNewDaoToken: 0,
    challengeAddress: defaultConfig.challengeDeposit.token,
    challengeAmount: BigNumber.from(defaultConfig.challengeDeposit.amount),
    challengeDecimals: 18, // TODO: this should be coming from the config
    isAnyAddress: false,
    executionAddressList: [''],
  });

  const handleIsExistingToken = useCallback(
    (e: any, onChange: (e: any) => void) => {
      // this will reset isScheduleNewDaoToken & isChallengeNewDaoToken
      // if isExistingToken is set to true
      if (e === 1) {
        setCollaterals({
          ...collaterals,
          isScheduleNewDaoToken: 0,
          isChallengeNewDaoToken: 0,
        });
      }
      onChange(e);
    },
    [collaterals],
  );

  const contextValue = useMemo(
    (): CreateDaoContext => ({
      basicInfo,
      setBasicInfo,

      config,
      setConfig,

      collaterals,
      setCollaterals,

      handleIsExistingToken,
    }),
    [basicInfo, config, collaterals, handleIsExistingToken],
  );

  return <UseCreateDao.Provider value={contextValue}>{children}</UseCreateDao.Provider>;
};

function useCreateDaoContext(): CreateDaoContext {
  return useContext(UseCreateDao) as CreateDaoContext;
}

export { CreateDaoProvider, useCreateDaoContext };
