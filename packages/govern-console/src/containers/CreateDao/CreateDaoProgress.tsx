import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import progressImage from '../../images/svgs/CreateDaoInProgress.svg';
import { CreateDaoSteps } from './utils/Shared';
import { ZERO_ADDRESS } from '../../utils/constants';
import { useCreateDaoContext } from './utils/CreateDaoContextProvider';
import ProgressComponent from './components/ProgressComponent';
import { CiruclarProgressStatus } from 'utils/types';
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

const CreateDaoProgress: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const walletContext: any = useWallet();
  const { provider, account } = walletContext;
  const { basicInfo, config, collaterals } = useCreateDaoContext();
  const [progressList, setProgressList] = useState([
    { status: CiruclarProgressStatus.InProgress, text: 'Uploading rules to IPFS' },
    { status: CiruclarProgressStatus.Disabled, text: 'Creating DAO' },
  ]);
  const [action, setAction] = useState<ReactNode | null>(null);
  const [showAction, setShowAction] = useState<'none' | 'fail' | 'register' | 'finish'>('none');
  const [rule, SetRule] = useState<BytesLike>('');
  const [isNewDaoTokenRegistered, setIsNewDaoTokenRegistered] = useState(false);
  const [daoTokenAddress, setDaoContractAddress] = useState('0x');

  const updateNewDaoTokenAddress = (value: string) => {
    setDaoContractAddress(value);
  };

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (daoTokenAddress !== '0x') {
        const isRegistered = await isTokenRegistered(provider.getSigner(), daoTokenAddress);
        console.log('useEffect checkIfRegistered', daoTokenAddress, isRegistered);
        setIsNewDaoTokenRegistered(isRegistered);
      }
    };
    checkIfRegistered();
  }, [daoTokenAddress, provider]);

  const createDaoParams: CreateDaoParams = useMemo(() => {
    // token
    let token: Partial<Token>;
    if (basicInfo.isExistingToken) {
      token = {
        tokenAddress: basicInfo.tokenAddress,
      };
    } else {
      token = {
        tokenDecimals: 6,
        tokenName: basicInfo.tokenName,
        tokenSymbol: basicInfo.tokenSymbol,
        mintAddress: account.address,
        mintAmount: basicInfo.tokenMintAmount.toString(),
        merkleRoot: '0x' + '00'.repeat(32),
        merkleMintAmount: 0,
      };
    }

    // config
    const daoConfig: DaoConfig = {
      executionDelay: config.executionDelay,
      scheduleDeposit: {
        token: collaterals.isScheduleNewDaoToken ? ZERO_ADDRESS : collaterals.scheduleAddress,
        amount: collaterals.scheduleAmount,
      },
      challengeDeposit: {
        token: collaterals.isChallengeNewDaoToken ? ZERO_ADDRESS : collaterals.challengeAddress,
        amount: collaterals.challengeAmount,
      },
      resolver: config.resolver,
      rules: rule,
      maxCalldataSize: config.maxCalldataSize,
    };

    // CreateDaoParams
    return {
      name: basicInfo.daoIdentifier,
      token,
      config: daoConfig,
      scheduleAccessList: collaterals.isAnyAddress ? [] : collaterals.executionAddressList,
      useProxies: basicInfo.isProxy,
    };
  }, [basicInfo, config, collaterals, rule]);

  const tokenRegister = useCallback(async () => {
    if (daoTokenAddress === '0x') return console.log('wrong address', daoTokenAddress);

    const newList = [...progressList];
    const registerProgressPosition = progressList.length;
    newList.push({
      status: CiruclarProgressStatus.InProgress,
      text: 'Register token in Aragon Voice',
    });
    setProgressList(newList);
    setShowAction('none');
    try {
      await registerToken(provider.getSigner(), daoTokenAddress);
      // if register successfull
      newList[registerProgressPosition].status = CiruclarProgressStatus.Done;
      setProgressList([...newList]);
      // setAction(<RegisterSuccessAction daoIdentifier={basicInfo.daoIdentifier} />);
      setShowAction('finish');
    } catch (error) {
      console.log('error', error);
      // if register fail
      newList[registerProgressPosition].status = CiruclarProgressStatus.Failed;
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
  useEffect(() => {
    console.log('start creating doa');
    const uploadToIpfs = async () => {
      const newList = [...progressList];
      try {
        const ruleCid = await addToIpfs(config.isRuleFile ? config.ruleFile : config.ruleText);
        SetRule(ruleCid);
        newList[0].status = CiruclarProgressStatus.Done;
        setProgressList(newList);
      } catch (error) {
        console.log('error', error);
        newList[0].status = CiruclarProgressStatus.Failed;
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
          newList[1].status = CiruclarProgressStatus.InProgress;
          setProgressList(newList);
          console.log('callCreateDao createDaoParams', createDaoParams);
          const result: any = await createDao(
            createDaoParams,
            {
              provider: window.ethereum,
              daoFactoryAddress: '0x91209b1352E1aD3abF7C7b74A899F3b118287f9D',
            },
            updateNewDaoTokenAddress,
          );
          await result.wait();
          console.log('callCreateDao', result);

          const newList2 = [...progressList];
          newList2[1].status = CiruclarProgressStatus.Done;
          setProgressList(newList2);
          setShowAction('register');
        } catch (error) {
          console.log('error', error);
          newList[1].status = CiruclarProgressStatus.Failed;
          setProgressList(newList);
          setShowAction('fail');
        }
      }
    };
    callCreateDao();
  }, [rule]);

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
      subTitle={'Hold tight your transaction is under process'}
      progressList={progressList}
      info={'Please be patient and do not close this window until it finishes.'}
      action={action}
    />
  );
};

export default CreateDaoProgress;
