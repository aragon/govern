import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import progressImage from '../../images/svgs/CreateDaoInProgress.svg';
import { CreateDaoSteps } from './utils/Shared';
import { useCreateDaoContext } from './utils/CreateDaoContextProvider';
import ProgressComponent from './components/ProgressComponent';
import { CircularProgressStatus } from 'utils/types';
import { parseUnits } from 'utils/lib';
import { constants } from 'ethers';
import { networkEnvironment } from 'environment';

const { daoFactoryAddress, governRegistryAddress } = networkEnvironment;

import {
  createDao,
  CreateDaoParams,
  DaoConfig,
  Token,
  registerToken,
  isTokenRegistered,
} from '@aragon/govern';
import { addToIpfs } from 'utils/ipfs';
import { BytesLike } from '@ethersproject/bytes';
import { useWallet } from 'AugmentedWallet';
import FailAction from './components/FailAction';
import SuccessAction from './components/SuccessAction';
import RegisterSuccessAction from './components/RegisterSuccessAction';

declare let window: any;

const CreateDaoProgress: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const walletContext: any = useWallet();
  const { provider, account } = walletContext;
  const { basicInfo, config, collaterals } = useCreateDaoContext();
  const [progressList, setProgressList] = useState([
    { status: CircularProgressStatus.InProgress, text: 'Uploading rules to IPFS' },
    { status: CircularProgressStatus.Disabled, text: 'Creating DAO' },
  ]);
  const [action, setAction] = useState<ReactNode | null>(null);
  const [showAction, setShowAction] = useState<'none' | 'fail' | 'register' | 'finish'>('none');
  const [rule, SetRule] = useState<BytesLike>('');
  const [isNewDaoTokenRegistered, setIsNewDaoTokenRegistered] = useState(false);
  const [daoTokenAddress, setDaoTokenAddress] = useState('0x');

  const updateNewDaoTokenAddress = (value: string) => {
    setDaoTokenAddress(value);
  };

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (daoTokenAddress !== '0x' && progressList[1].status !== CircularProgressStatus.Done) {
        const isRegistered = await isTokenRegistered(provider.getSigner(), daoTokenAddress);
        setIsNewDaoTokenRegistered(isRegistered);

        // update create dao status
        const newList2 = [...progressList];
        newList2[1].status = CircularProgressStatus.Done;
        setProgressList(newList2);
        setShowAction('register');
      }
    };
    checkIfRegistered();
  }, [daoTokenAddress, provider, progressList]);

  const createDaoParams: CreateDaoParams = useMemo(() => {
    // token
    let token: Partial<Token>;
    if (basicInfo.isExistingToken) {
      token = {
        tokenAddress: basicInfo.tokenAddress,
      };
    } else {
      token = {
        tokenDecimals: basicInfo.tokenDecimals,
        tokenName: basicInfo.tokenName,
        tokenSymbol: basicInfo.tokenSymbol,
        mintAddress: account.address,
        mintAmount:
          basicInfo.tokenDecimals > 0
            ? parseUnits(basicInfo.tokenMintAmount, basicInfo.tokenDecimals)
            : basicInfo.tokenMintAmount,
        merkleRoot: '0x' + '00'.repeat(32),
        merkleMintAmount: 0,
        merkleTree: '0x',
        merkleContext: '0x',
      };
    }

    // config
    const daoConfig: DaoConfig = {
      executionDelay: config.executionDelay,
      scheduleDeposit: {
        token: collaterals.isScheduleNewDaoToken
          ? constants.AddressZero
          : collaterals.scheduleAddress,
        amount:
          collaterals.scheduleDecimals > 0
            ? parseUnits(collaterals.scheduleAmount, collaterals.scheduleDecimals)
            : collaterals.scheduleAmount,
      },
      challengeDeposit: {
        token: collaterals.isChallengeNewDaoToken
          ? constants.AddressZero
          : collaterals.challengeAddress,
        amount:
          collaterals.challengeDecimals > 0
            ? parseUnits(collaterals.challengeAmount, collaterals.challengeDecimals)
            : collaterals.challengeAmount,
      },
      resolver: config.resolver,
      rules: rule,
      maxCalldataSize: config.maxCalldataSize,
    };

    // CreateDaoParams
    return {
      token,
      scheduleAccessList: collaterals.isAnyAddress ? [] : collaterals.executionAddressList,
      useProxies: basicInfo.isProxy,
      config: daoConfig,
      name: basicInfo.daoIdentifier,
    };
  }, [basicInfo, config, collaterals, rule, account]);

  const tokenRegister = useCallback(async () => {
    if (daoTokenAddress === '0x') {
      console.log('wrong address', daoTokenAddress);
      return;
    }

    const newList = [...progressList];
    const registerProgressPosition = progressList.length;
    newList.push({
      status: CircularProgressStatus.InProgress,
      text: 'Registering token on Aragon Voice',
    });
    setProgressList(newList);
    setShowAction('none');
    try {
      await registerToken(provider.getSigner(), daoTokenAddress);
      // if register successfull
      newList[registerProgressPosition].status = CircularProgressStatus.Done;
      setProgressList([...newList]);
      // setAction(<RegisterSuccessAction daoIdentifier={basicInfo.daoIdentifier} />);
      setShowAction('finish');
    } catch (error) {
      console.log('error', error);
      // if register fail
      newList[registerProgressPosition].status = CircularProgressStatus.Failed;
      setProgressList([...newList]);
      // TODO: in this case what we do with failed register
      setShowAction('register');
    }
  }, [progressList, provider, daoTokenAddress]);

  // start creating dao
  // this component assumes all configs and input needed for created a DAO is provided
  // so it start trying to create the DAO once componentDidMount
  // first by uploading rules to IPFS
  // second by actually creating the DAO
  /* eslint-disable */
  useEffect(() => {
    const uploadToIpfs = async () => {
      const newList = [...progressList];
      try {
        const ruleCid = await addToIpfs(config.isRuleFile ? config.ruleFile[0] : config.ruleText);
        SetRule(ruleCid);
        newList[0].status = CircularProgressStatus.Done;
        setProgressList(newList);
      } catch (error) {
        console.log('error', error);
        newList[0].status = CircularProgressStatus.Failed;
        setProgressList(newList);
        setShowAction('fail');
        return;
      }
    };
    uploadToIpfs();
  }, []);
  // creating the DAO
  useEffect(() => {
    const callCreateDao = async () => {
      if (rule !== '') {
        const newList = [...progressList];
        try {
          newList[1].status = CircularProgressStatus.InProgress;
          setProgressList(newList);
          const result: any = await createDao(
            createDaoParams,
            {
              provider: window.ethereum,
              daoFactoryAddress: daoFactoryAddress,
              governRegistry: governRegistryAddress,
            },
            updateNewDaoTokenAddress,
          );
          await result.wait();

          if (basicInfo.isExistingToken) updateNewDaoTokenAddress(basicInfo.tokenAddress);
        } catch (error) {
          console.log('error', error);
          newList[1].status = CircularProgressStatus.Failed;
          setProgressList(newList);
          setShowAction('fail');
        }
      }
    };
    callCreateDao();
  }, [rule]);
  /* eslint-disable */

  useEffect(() => {
    switch (showAction) {
      case 'fail':
        setAction(<FailAction setActiveStep={setActiveStep} />);
        break;

      case 'register':
        setAction(
          <SuccessAction
            isNewDaoTokenRegistered={isNewDaoTokenRegistered}
            daoTokenAddress={daoTokenAddress}
            tokenRegister={tokenRegister}
            daoIdentifier={basicInfo.daoIdentifier}
          />,
        );
        break;

      case 'finish':
        setAction(<RegisterSuccessAction daoIdentifier={basicInfo.daoIdentifier} />);
        break;

      default:
        setAction(null);
        break;
    }
  }, [
    showAction,
    isNewDaoTokenRegistered,
    daoTokenAddress,
    tokenRegister,
    setActiveStep,
    basicInfo,
  ]);

  return (
    <ProgressComponent
      image={progressImage}
      title={'Creating your DAO'}
      subTitle={'Your transaction is in progress.'}
      progressList={progressList}
      info={
        showAction === 'none'
          ? 'Please be patient and do not close this window until it finishes.'
          : ''
      }
      action={action}
    />
  );
};

export default CreateDaoProgress;
