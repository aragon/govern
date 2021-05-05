/* eslint-disable */
import React, { useState, memo, useEffect, useMemo, useCallback } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { useTheme, styled } from '@material-ui/core/styles';
import backButtonIcon from '../../images/back-btn.svg';
import Typography from '@material-ui/core/Typography';
import { InputField } from 'components/InputFields/InputField';
import { useHistory } from 'react-router-dom';
import CreateDaoImage from '../../images/svgs/CreateDao.svg';
import CreateDaoInProgressImage from '../../images/svgs/CreateDaoInProgress.svg';
import GreenTickImage from '../../images/svgs/green_tick.svg';
import CrossImage from '../../images/svgs/cross.svg';
import { BlueSwitch } from 'components/Switchs/BlueSwitch';
import { BlueCheckbox } from 'components/Checkboxs/BlueCheckbox';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';
import { ANWrappedPaper } from 'components/WrapperPaper/ANWrapperPaper';
import { useWallet } from '../../EthersWallet';
import {
  createDao,
  CreateDaoParams,
  DaoConfig,
  Token,
  getToken,
} from '@aragon/govern';
// Note: query should not be needed once DAO page is capable of auto query
import { GET_DAO_BY_NAME } from '../Console/queries';
import { useQuery } from '@apollo/client';
import {
  ARAGON_VOICE_URL,
  PROXY_CONTRACT_URL,
  DEFAULT_DAO_CONFIG,
  CONFIRMATION_WAIT,
} from '../../utils/constants';
import { useForm, Controller } from 'react-hook-form';
import { ChainId } from '../../utils/types';

enum CreateDaoStatus {
  PreCreate,
  InProgress,
  Successful,
  Failed,
}

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

interface FormInputs {
  /**
   * Use's input
   */
  daoName: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  isExistingToken: boolean;
  useProxy: boolean;
  useVocdoni: boolean;
  /**
   * DAO's configs
   */
  daoConfig: DaoConfig;
}

const optionTextStyle = {
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 18,
};

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

const NewDaoForm: React.FC<FormProps> = memo(
  ({ setCreateDaoStatus, setCreatedDaoRoute, cancelForm }) => {
    const context: any = useWallet();
    const { chainId, status, ethersProvider } = context;

    const {
      control,
      handleSubmit,
      watch,
      setValue,
      getValues,
    } = useForm<FormInputs>();

    const connectedChainId = useMemo(() => {
      if (chainId === ChainId.RINKEBY && status === 'connected')
        return ChainId.RINKEBY;

      return ChainId.MAINNET;
    }, [chainId, status]);

    // use appropriate default config
    useEffect(() => {
      const _config: DaoConfig = DEFAULT_DAO_CONFIG[connectedChainId];
      setValue('daoConfig', _config);
    }, [connectedChainId]);

    const getTokenInfo = async (tokenAddress: string) => {
      //TODO: handle etherProvider in case wallet is not connected
      try {
        const token = await getToken(tokenAddress, ethersProvider);
        return token;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    const createDaoCall = async (params: FormInputs): Promise<boolean> => {
      let token: Partial<Token>;
      if (params.isExistingToken) {
        const tokenInfo = await getTokenInfo(params.tokenAddress);
        if (tokenInfo !== false) {
          token = tokenInfo;
        } else {
          return false;
        }
      } else {
        token = {
          tokenDecimals: 18,
          tokenName: params.tokenName,
          tokenSymbol: params.tokenSymbol,
        };
      }

      // if the vocdoni is activated, we also register the token in the aragon voice.
      let registerTokenCallback = undefined;
      if (params.useVocdoni) {
        registerTokenCallback = async (registerToken: Function) => {
          const result = await registerToken();
          console.log('result', result);
        };
      }

      const createDaoParams: CreateDaoParams = {
        name: params.daoName,
        token,
        config: params.daoConfig,
        useProxies: params.useProxy,
        useVocdoni: params.useVocdoni,
      };

      try {
        //TODO this console log to be removed
        console.log('createDaoParams', createDaoParams);
        const result: any = await createDao(
          createDaoParams,
          {},
          registerTokenCallback,
        );
        await result.wait(CONFIRMATION_WAIT);
        setCreatedDaoRoute(params.daoName);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    const submitCreateDao = async (formData: FormInputs) => {
      setCreateDaoStatus(CreateDaoStatus.InProgress);
      const callResult = await createDaoCall(formData);
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
          <Controller
            name="daoName"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                label={''}
                onInputChange={onChange}
                height="46px"
                width="454px"
                placeholder={'Please insert your DAO name...'}
                value={value}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
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
            <Controller
              name="isExistingToken"
              control={control}
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <BlueSwitch onChange={onChange} value={value} />
              )}
            />
            <div style={optionTextStyle}>{'Use existing token'}</div>
          </div>
          {!watch('isExistingToken') ? (
            <div>
              <InputTitle>Token</InputTitle>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Controller
                  name="tokenName"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <InputField
                      label={''}
                      onInputChange={onChange}
                      height="46px"
                      width="200px"
                      placeholder={"Your Token's Name?"}
                      value={value}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
                <Controller
                  name="tokenSymbol"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <InputField
                      label={''}
                      onInputChange={onChange}
                      height="46px"
                      width="200px"
                      placeholder={"Your Token's Symbol?"}
                      value={value}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            <div>
              <InputTitle>Token Address</InputTitle>
              <Controller
                name="tokenAddress"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <InputField
                    label={''}
                    onInputChange={onChange}
                    height="46px"
                    width="451px"
                    placeholder={
                      'Please insert existing token ether address (0x000...)'
                    }
                    value={value}
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
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
              <Controller
                name="useProxy"
                control={control}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                  <BlueCheckbox onChange={onChange} checked={value} />
                )}
              />
            </div>
            <div style={optionTextStyle}>
              Use{' '}
              <a
                href={PROXY_CONTRACT_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                Proxies
              </a>{' '}
              for the deployment - This will enable your DAO to use the already
              deployed code of the Govern Executer and Queue, and heavily
              decrease gas costs for your DAO deployment.
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
              <Controller
                name="useVocdoni"
                control={control}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                  <BlueCheckbox onChange={onChange} checked={value} />
                )}
              />
            </div>
            <div style={optionTextStyle}>
              Use{' '}
              <a
                href={ARAGON_VOICE_URL[connectedChainId]}
                target="_blank"
                rel="noreferrer noopener"
              >
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
              disabled={status !== 'connected'}
              label="Create new DAO"
              buttonType="primary"
              style={{ marginTop: 40 }}
              onClick={handleSubmit(submitCreateDao)}
            />
          </div>
        </ANWrappedPaper>
      </div>
    );
  },
);

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
              buttonType="primary"
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
  const history = useHistory();

  const [createDaoStatus, setCreateDaoStatus] = useState<CreateDaoStatus>(
    CreateDaoStatus.PreCreate,
  );
  const [createdDaoRoute, setCreatedDaoRoute] = useState<string>('#');

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
