import React, { useMemo, useState, useContext } from 'react';
import { BigNumber, BytesLike } from 'ethers';
import { DEFAULT_DAO_CONFIG } from 'utils/constants';
import { useWallet } from 'AugmentedWallet';
import { DaoConfig } from '@aragon/govern';

export interface ICreateDaoBasicInfo {
  daoIdentifier: string;
  isExistingToken: boolean;
  tokenName: string;
  tokenSymbol: string;
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
}

export interface ICreateDaoCollaterals {
  isScheduleNewDaoToken: boolean;
  scheduleAddress: string;
  scheduleAmount: BigNumber | string;
  isChallengeNewDaoToken: boolean;
  challengeAddress: string;
  challengeAmount: BigNumber | string;
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
  const walletContext: any = useWallet();
  const { chainId } = walletContext;
  const defaultConfig: DaoConfig = (DEFAULT_DAO_CONFIG as any)[chainId];

  const [basicInfo, setBasicInfo] = useState<ICreateDaoBasicInfo>({
    daoIdentifier: '',
    isExistingToken: false,
    tokenName: '',
    tokenSymbol: '',
    tokenAddress: '',
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
  });

  const [collaterals, setCollaterals] = useState<ICreateDaoCollaterals>({
    isScheduleNewDaoToken: false,
    scheduleAddress: defaultConfig.scheduleDeposit.token,
    scheduleAmount: BigNumber.from(defaultConfig.scheduleDeposit.amount),
    isChallengeNewDaoToken: false,
    challengeAddress: defaultConfig.challengeDeposit.token,
    challengeAmount: BigNumber.from(defaultConfig.challengeDeposit.amount),
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
