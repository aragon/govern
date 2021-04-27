/* eslint-disable */
import React, { useState, memo, useRef, useEffect } from 'react';
import { ANButton } from '../../components/Button/ANButton';
import { useTheme, styled } from '@material-ui/core/styles';
import backButtonIcon from '../../images/back-btn.svg';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { InputField } from '../../components/InputFields/InputField';
import { useHistory } from 'react-router-dom';
import CreateDaoImage from '../../images/svgs/CreateDao.svg';
import CreateDaoInProgressImage from '../../images/svgs/CreateDaoInProgress.svg';
import GreenTickImage from '../../images/svgs/green_tick.svg';
import CrossImage from '../../images/svgs/cross.svg';
import { BlueSwitch } from '../../components/Switchs/BlueSwitch';
import { BlueCheckbox } from '../../components/Checkboxs/BlueCheckbox';
import { ANCircularProgressWithCaption } from '../../components/CircularProgress/ANCircularProgressWithCaption';
import { ANWrappedPaper } from '../../components/WrapperPaper/ANWrapperPaper';
import { useWallet } from '../../EthersWallet';
import {
  createDao,
  CreateDaoParams,
  CreateDaoOptions,
  Token,
  getToken,
} from '@aragon/govern';
// Note: query should not be needed once DAO page is capable of auto query
import { GET_DAO_BY_NAME } from '../Console/queries';
import { useQuery } from '@apollo/client';

enum CreateDaoStatus {
  PreCreate,
  InProgress,
  Successful,
  Failed,
}

const aragonFreeVotingUrl = '#';

interface FormProps {
  /*
        change create dao process (stage) status
    */
  setCreateDaoStatus: (status: CreateDaoStatus) => void;

  /*
        set created dao route
    */
  setCreatedDaoRoute: (route: string) => void;
  /*
        cancel form and go back
    */
  cancelForm(): void;
}

interface ResultProps {
  /**
      success or failed result
   */
  isSuccess: boolean;

  /**
      change/update creating dao status
   */
  setCreateDaoStatus(status: CreateDaoStatus): void;

  /*
        value to be passed to progress bar: range 0-100
    */
  postResultActionRoute: string;
}

const BackButton = styled('div')({
  height: 25,
  width: 62,
  cursor: 'pointer',
  position: 'relative',
  left: -6,
});

const InputTitle = styled(Typography)({
  width: '454px',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
});

const Title = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 28,
  lineHeight: '38px',
  color: '#20232C',
  marginTop: 17,
  height: 50,
  display: 'flex',
  justifyContent: 'center',
});

const SubTitle = styled(Typography)({
  width: '365px',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  margin: '0px 50px 0px 50px',
});

const optionTextStyle = {
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 18,
};

const NewDaoForm: React.FC<FormProps> = ({
  setCreateDaoStatus,
  setCreatedDaoRoute,
  cancelForm,
}) => {
  const context: any = useWallet();
  const [isExistingToken, updateIsExistingToken] = useState(false);
  const [isUseProxyChecked, updateIsUseProxyChecked] = useState(true);
  const [isUseFreeVotingChecked, updateIsUseFreeVotingChecked] = useState(true);
  const daoName = useRef<string>();
  const doaNameError = useRef<string | undefined>();
  const tokenName = useRef<string>();
  const tokenNameError = useRef<string | undefined>();
  const tokenSymbol = useRef<string>();
  const tokenSymbolError = useRef<string | undefined>();
  const existingTokenAddress = useRef<string>();
  const existingTokenAddressError = useRef<string | undefined>();
  // TODO: dai and court contract should, have a default fetch from an env or constants,
  // and should be user updatable once UI is ready
  const executionDelay = useRef<number>(86400); // defaults to one day - how many seconds to wait before being able to call execute.
  const scheduleContract = useRef<string>(
    '0xb08E32D658700f768f5bADf0679E153ffFEC42e6',
  );
  const scheduleTokenAmount = useRef<number>(0);
  const challengeContract = useRef<string>(
    '0xb08E32D658700f768f5bADf0679E153ffFEC42e6',
  );
  const challengeTokenAmount = useRef<number>(0);
  const resolverContract = useRef<string>(
    '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
  );
  const rules = useRef<string>('0x'); // in hex
  const maxCalldataSize = useRef<number>(100000); // initial maxCalldatasize

  const onExecutionDelayChange = (val: any) => {
    executionDelay.current = val;
  };

  const onScheduleContractChange = (val: any) => {
    scheduleContract.current = val;
  };

  const onScheduleTokenAmountChange = (val: any) => {
    scheduleTokenAmount.current = val;
  };

  const onChallengeContractChange = (val: any) => {
    challengeContract.current = val;
  };

  const onChallengeTokenAmountChange = (val: any) => {
    challengeTokenAmount.current = val;
  };

  const onResolverChange = (val: any) => {
    rules.current = val;
  };

  const onRulesChange = (val: any) => {
    rules.current = val; // should be converted to hex
  };

  const onMaxCalldataSizeChange = (val: any) => {
    maxCalldataSize.current = val;
  };

  const onChangeDaoName = (val: any) => {
    daoName.current = val;
    doaNameError.current = '';
  };

  const onChangeTokenName = (val: any) => {
    tokenName.current = val;
    tokenNameError.current = '';
  };

  const onChangeTokenSymbol = (val: any) => {
    tokenSymbol.current = val;
    tokenSymbolError.current = '';
  };

  const onChangeExistingTokenAddress = (val: any) => {
    existingTokenAddress.current = val;
    existingTokenAddressError.current = '';
  };

  const createDaoConfig = {
    executionDelay: executionDelay.current,
    scheduleDeposit: {
      token: scheduleContract.current,
      amount: scheduleTokenAmount.current,
    },
    challengeDeposit: {
      token: challengeContract.current,
      amount: challengeTokenAmount.current,
    },
    resolver: resolverContract.current,
    rules: rules.current,
    maxCalldataSize: maxCalldataSize.current,
  };

  const createDaoCall = async (
    isExistingToken: boolean,
    existingTokenAddress: string,
    tokenName: string,
    tokenSymbol: string,
    isUseProxyChecked: boolean,
    daoName: string,
    isUseFreeVotingChecked: boolean,
    context: any,
  ): Promise<boolean> => {
    let token: Token;
    if (isExistingToken) {
      try {
        token = await getToken(existingTokenAddress, context.ethersProvider);
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      token = {
        tokenAddress: '',
        tokenDecimals: 18,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
      };
    }
    const createDaoParams: CreateDaoParams = {
      name: daoName,
      token,
      config: createDaoConfig,
      useProxies: isUseProxyChecked,
      useVocdoni: isUseFreeVotingChecked,
    };

    try {
      const result: any = await createDao(createDaoParams);
      setCreatedDaoRoute(daoName);
      await result.wait(1);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // TODO: Create Validation for form, inputField may need further customization
  const validateForm = (): boolean => {
    if (daoName.current === '' || typeof daoName.current === 'undefined') {
      doaNameError.current = 'Error';
      return false;
    }
    return true;
  };

  const submitCreateDao = async () => {
    // TODO: form validation
    // if(validateForm() === false) {
    //   console.log('submitCreateDao, validateForm()', validateForm())
    //   return null;
    // }
    setCreateDaoStatus(CreateDaoStatus.InProgress);
    const callResult = await createDaoCall(
      isExistingToken,
      existingTokenAddress.current
        ? existingTokenAddress.current.toString()
        : '',
      tokenName.current ? tokenName.current.toString() : '',
      tokenSymbol.current ? tokenSymbol.current.toString() : '',
      isUseProxyChecked,
      daoName.current ? daoName.current.toString() : '',
      isUseFreeVotingChecked,
      context,
    );

    if (callResult) {
      setCreateDaoStatus(CreateDaoStatus.Successful);
    } else {
      setCreateDaoStatus(CreateDaoStatus.Failed);
    }
  };

  return (
    <div
      style={{
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <ANWrappedPaper>
        <BackButton onClick={cancelForm}>
          <img src={backButtonIcon} />
        </BackButton>
        <img src={CreateDaoImage} />
        <InputTitle>DAO Name</InputTitle>
        <InputField
          label={doaNameError.current === undefined ? '' : doaNameError.current}
          onInputChange={onChangeDaoName}
          height="46px"
          width="454px"
          placeholder={'Please insert your DAO name...'}
          value={daoName.current}
        ></InputField>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '25px',
            verticalAlign: 'middle',
            lineHeight: '40px',
          }}
        >
          <div style={optionTextStyle}>{'Create new token'}</div>
          <BlueSwitch
            checked={isExistingToken}
            onChange={() => {
              updateIsExistingToken(!isExistingToken);
            }}
            name="checked"
          />
          <div style={optionTextStyle}>{'Use existing token'}</div>
        </div>
        {!isExistingToken ? (
          <div>
            <InputTitle>Token</InputTitle>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <InputField
                label=""
                onInputChange={onChangeTokenName}
                value={tokenName.current}
                height="46px"
                width="200px"
                placeholder={"Your Token's Name?"}
              />

              <InputField
                label=""
                onInputChange={onChangeTokenSymbol}
                height="46px"
                width="200px"
                placeholder={"Your Token's Symbol?"}
                value={tokenSymbol.current}
              />
            </div>
          </div>
        ) : (
          <div>
            <InputTitle>Token Address</InputTitle>
            <InputField
              label=""
              onInputChange={onChangeExistingTokenAddress}
              height="46px"
              width="451px"
              placeholder={
                'Please insert existing token ether address (0x000...)'
              }
              value={existingTokenAddress.current}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '25px',
          }}
        >
          <div
            style={{
              marginTop: -5,
            }}
          >
            <BlueCheckbox
              checked={isUseProxyChecked}
              onChange={() => {
                updateIsUseProxyChecked(!isUseProxyChecked);
              }}
            />
          </div>
          <div style={optionTextStyle}>
            Use Govern Agent Proxy - This will enable your DAO to use Aragon
            Govern main executer queue, and heavily decrease gas costs for your
            DAO deployment
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '25px',
          }}
        >
          <div
            style={{
              marginTop: -5,
            }}
          >
            <BlueCheckbox
              checked={isUseFreeVotingChecked}
              onChange={() => {
                updateIsUseFreeVotingChecked(!isUseFreeVotingChecked);
              }}
            />
          </div>
          <div style={optionTextStyle}>
            Use{' '}
            <a target="_blank" href={aragonFreeVotingUrl}>
              Aragon Voice
            </a>{' '}
            - This will enable your DAO to have free voting for you proposals
          </div>
        </div>
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <ANButton
            label="Create new DAO"
            type="primary"
            style={{ marginTop: 40 }}
            onClick={submitCreateDao}
          />
        </div>
      </ANWrappedPaper>
    </div>
  );
};

const NewDaoProgress: React.FC = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        height: '80vh',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ANWrappedPaper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <img
            src={CreateDaoInProgressImage}
            style={{ width: '242px', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <Title>Creating your DAO</Title>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <SubTitle>Hold tight your transaction is under process</SubTitle>
          </div>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              marginTop: '10px',
            }}
          >
            <ANCircularProgressWithCaption caption={'Creating DAO'} state={1} />
          </div>
          <div
            style={{
              borderRadius: '10px',
              background: '#ECFAFF',
              width: '446px',
              height: '51px',
              lineHeight: '51px',
              textAlign: 'center',
              marginTop: '40px',
              fontFamily: 'Manrope',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 14,
              color: '#0176FF',
            }}
          >
            Please be patient and do not close this window until it finishes.
          </div>
        </div>
      </ANWrappedPaper>
    </div>
  );
};

const NewDaoCreationResult: React.FC<ResultProps> = ({
  isSuccess,
  setCreateDaoStatus,
  postResultActionRoute,
}) => {
  const history = useHistory();

  const [daoDetail, setDaoDetail] = useState<any>({});

  const {
    data: daoDetailData,
    loading: isLoadingDaoDetail,
    error: errorLoadingDaoDetail,
    fetchMore: fetchMoreDetail,
  } = useQuery(GET_DAO_BY_NAME, {
    variables: {
      name: postResultActionRoute,
    },
  });

  useEffect(() => {
    if (daoDetailData && daoDetailData.name) {
      console.log('daoDetailData', daoDetailData);
      setDaoDetail(daoDetailData);
    }
  }, [daoDetailData]);

  const fetchDetail = async () => {
    console.log('calling fetchDetail');
    const {
      data: moreData,
      loading: loadingMore,
    }: { data: any; loading: boolean } = await fetchMoreDetail({
      variables: {
        name: postResultActionRoute,
      },
    });
    console.log('fetchDetail:', moreData);
    if (moreData && moreData.name) {
      setDaoDetail(moreData);
    }
  };

  return (
    <div
      style={{
        height: '80vh',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ANWrappedPaper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <img
            src={isSuccess ? GreenTickImage : CrossImage}
            style={{
              width: '88px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '88px',
            }}
          />
          <Title>
            {isSuccess ? 'Your DAO is ready' : 'Somthing went wrong'}
          </Title>
          <SubTitle>
            {isSuccess
              ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor'
              : 'An error has occurred during the signature process. Do not worry, you can try again without losing your information.'}
          </SubTitle>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <ANButton
              width={'446px'}
              label={isSuccess ? 'Get started' : 'Ok, let’s try again'}
              type="primary"
              style={{ marginTop: 40 }}
              onClick={async () => {
                if (isSuccess) {
                  // await fetchDetail();
                  // console.log('queried dao detail', daoDetail)
                  history.push('daos/' + postResultActionRoute);
                } else {
                  setCreateDaoStatus(CreateDaoStatus.PreCreate);
                }
              }}
            />
          </div>
        </div>
      </ANWrappedPaper>
    </div>
  );
};

const NewDaoContainer: React.FC = () => {
  const [createDaoStatus, setCreateDaoStatus] = useState<CreateDaoStatus>(
    CreateDaoStatus.PreCreate,
  );
  const [createdDaoRoute, setCreatedDaoRoute] = useState<string>('#');
  const history = useHistory();

  const onClickBackFromCreateDaoPage = () => {
    history.goBack();
  };

  switch (createDaoStatus) {
    case CreateDaoStatus.PreCreate: {
      return (
        <NewDaoForm
          setCreateDaoStatus={setCreateDaoStatus}
          setCreatedDaoRoute={setCreatedDaoRoute}
          cancelForm={onClickBackFromCreateDaoPage}
        />
      );
    }
    case CreateDaoStatus.InProgress: {
      return <NewDaoProgress />;
    }
    case CreateDaoStatus.Successful: {
      return (
        <NewDaoCreationResult
          isSuccess={true}
          setCreateDaoStatus={setCreateDaoStatus}
          postResultActionRoute={createdDaoRoute}
        />
      );
    }
    case CreateDaoStatus.Failed: {
      return (
        <NewDaoCreationResult
          isSuccess={false}
          setCreateDaoStatus={setCreateDaoStatus}
          postResultActionRoute={'#'}
        />
      );
    }
    default: {
      return (
        <NewDaoForm
          setCreateDaoStatus={setCreateDaoStatus}
          setCreatedDaoRoute={setCreatedDaoRoute}
          cancelForm={onClickBackFromCreateDaoPage}
        />
      );
    }
  }
};

export default memo(NewDaoContainer);
