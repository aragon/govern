import React, { useMemo, useState, useContext } from 'react';
import { BigNumber, BytesLike } from 'ethers';
import { networkEnvironment } from 'environment';

export interface ICreateDaoBasicInfo {
  daoIdentifier: string;
  isExistingToken: boolean;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenMintAmount: BigNumber | null;
  isProxy: boolean;
}

export interface ICreateDaoConfig {
  executionDelay: number;
  isRuleFile: boolean;
  ruleFile: any;
  ruleText: BytesLike;
  resolver: string;
}

export interface ICreateDaoCollaterals {
  scheduleAddress: string;
  scheduleAmount: BigNumber | null;
  isScheduleNewDaoToken: boolean;
  challengeAddress: string;
  challengeAmount: BigNumber | null;
  isChallengeNewDaoToken: boolean;
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
}

const UseCreateDaoContext = React.createContext<CreateDaoContext | null>(null);

const CreateDaoProvider: React.FC = ({ children }) => {
  const { defaultDaoConfig: defaultConfig } = networkEnvironment;

  const [basicInfo, setBasicInfo] = useState<ICreateDaoBasicInfo>({
    daoIdentifier: '',
    isExistingToken: false,
    tokenName: '',
    tokenSymbol: '',
    tokenAddress: '',
    tokenMintAmount: null,
    isProxy: true,
  });

  const [config, setConfig] = useState<ICreateDaoConfig>({
    executionDelay: parseInt(defaultConfig.executionDelay.toString()),
    isRuleFile: false,
    ruleFile: '',
    ruleText: defaultConfig.rules,
    resolver: defaultConfig.resolver,
  });

  const [collaterals, setCollaterals] = useState<ICreateDaoCollaterals>({
    scheduleAddress: defaultConfig.scheduleDeposit.token,
    scheduleAmount: BigNumber.from(defaultConfig.scheduleDeposit.amount),
    isScheduleNewDaoToken: false,
    challengeAddress: defaultConfig.challengeDeposit.token,
    challengeAmount: BigNumber.from(defaultConfig.challengeDeposit.amount),
    isChallengeNewDaoToken: true,
    isAnyAddress: false,
    executionAddressList: [''],
  });

  const contextValue = useMemo(
    (): CreateDaoContext => ({
      basicInfo,
      setBasicInfo,

      config,
      setConfig,

      collaterals,
      setCollaterals,
    }),
    [basicInfo, config, collaterals],
  );
  return (
    <UseCreateDaoContext.Provider value={contextValue}>{children}</UseCreateDaoContext.Provider>
  );
};

function useCreateDao(): CreateDaoContext {
  return useContext(UseCreateDaoContext) as CreateDaoContext;
}

export { CreateDaoProvider, useCreateDao };
