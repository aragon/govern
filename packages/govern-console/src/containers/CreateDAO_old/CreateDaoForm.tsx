import React, { memo, useEffect, useMemo } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { styled } from '@material-ui/core/styles';
import backButtonIcon from '../../images/back-btn.svg';
import Typography from '@material-ui/core/Typography';
import { InputField } from 'components/InputFields/InputField';
import CreateDaoImage from '../../images/pngs/create_dao@2x.png';
import { BlueSwitch } from 'components/Switchs/BlueSwitch';
import { BlueCheckbox } from 'components/Checkboxs/BlueCheckbox';
import { ANWrappedPaper } from 'components/WrapperPaper/ANWrapperPaper';
import { useWallet } from '../../AugmentedWallet';
import { createDao, CreateDaoParams, DaoConfig, Token } from '@aragon/govern';
import { ARAGON_VOICE_URL, PROXY_CONTRACT_URL, DEFAULT_DAO_CONFIG } from 'utils/constants';
import { useForm, Controller } from 'react-hook-form';
import { ChainId, CiruclarProgressStatus } from '../../utils/types';
import { validateToken } from '../../utils/validations';
import { CreateDaoStatus } from './CreateDao';
import { CreateDaoProgressProps } from './CreateDaoProgress';
import { ContractReceipt } from 'ethers';

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

interface FormProps {
  /**
   * update creation progress
   */
  setProgress: (progress: CreateDaoProgressProps) => void;
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

const ImageContainer = styled('div')({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
});

const Image = styled('img')({
  minWidth: '100px',
  maxWidth: '354.75px',
  // height: '329.25px',
  height: 'auto',
});

const FormContainer = styled('div')({
  // height: window.innerHeight * 0.7,
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
});

const ContentRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  verticalAlign: 'middle',
  lineHeight: '40px',
});

const SwitchRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  verticalAlign: 'middle',
  margin: '25px 25px 5px 25px',
});

const OptionText = styled('div')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 18,
  lineHeight: '22.08px',
});

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
  marginBottom: '15px',
});

const CreateDaoForm: React.FC<FormProps> = ({
  setProgress,
  setCreateDaoStatus,
  setCreatedDaoRoute,
  cancelForm,
}) => {
  const context: any = useWallet();
  const { chainId, provider, isConnected } = context;

  const { control, handleSubmit, watch, setValue } = useForm<FormInputs>();

  const connectedChainId = useMemo(() => {
    if (chainId === ChainId.RINKEBY && isConnected) return ChainId.RINKEBY;

    return ChainId.MAINNET;
  }, [chainId, isConnected]);

  useEffect(() => {
    const _config: DaoConfig = DEFAULT_DAO_CONFIG[connectedChainId];
    if (setValue) setValue('daoConfig', _config);
  }, [connectedChainId, setValue]);

  const submitCreateDao = async (params: FormInputs) => {
    let token: Partial<Token>;

    const progress: CreateDaoProgressProps = {
      isTokenRegister: true,
      progressStatus: {
        create: CiruclarProgressStatus.InProgress,
        register: CiruclarProgressStatus.Disabled,
      },
    };

    if (params.isExistingToken) {
      token = {
        tokenAddress: params.tokenAddress,
      };
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
      // update progress
      setProgress({ ...progress });

      // TODO: Typescript doesn't allow `Function` type instead of any...
      registerTokenCallback = async (registerToken: any) => {
        // update progress
        progress.progressStatus = {
          create: CiruclarProgressStatus.Done,
          register: CiruclarProgressStatus.InProgress,
        };
        setProgress({ ...progress });

        const result: ContractReceipt | undefined = await registerToken();
        if (typeof result === 'undefined' || result.status === 1) {
          // handle token already registed
          progress.progressStatus.register = CiruclarProgressStatus.Done;
          setProgress({ ...progress });
          setTimeout(() => {
            setCreateDaoStatus(CreateDaoStatus.Successful);
          }, 2000); // delay 2 seconds, so user can obeserve each progress result.
        } else {
          // update progress
          progress.progressStatus.register = CiruclarProgressStatus.Failed;
          setProgress({ ...progress });
          setTimeout(() => {
            setCreateDaoStatus(CreateDaoStatus.Failed);
          }, 2000);
        }
      };
    } else {
      // update progress
      progress.isTokenRegister = false;
      setProgress({ ...progress });
    }

    const createDaoParams: CreateDaoParams = {
      name: params.daoName,
      token,
      config: params.daoConfig,
      useProxies: params.useProxy,
      useVocdoni: params.useVocdoni,
    };

    try {
      setCreateDaoStatus(CreateDaoStatus.InProgress);

      const result: any = await createDao(createDaoParams, {}, registerTokenCallback);

      await result.wait();

      setCreatedDaoRoute(params.daoName);

      // update progress
      progress.progressStatus.create = CiruclarProgressStatus.Done;
      setProgress({ ...progress });

      // set creation successful if Vocdoni not used
      if (!params.useVocdoni)
        setTimeout(() => {
          setCreateDaoStatus(CreateDaoStatus.Successful);
        }, 2000);
    } catch (error) {
      console.log(error);
      setCreateDaoStatus(CreateDaoStatus.Failed);
    }
  };

  return (
    <FormContainer>
      <ANWrappedPaper>
        <BackButton onClick={cancelForm}>
          <img src={backButtonIcon} />
        </BackButton>
        <ImageContainer>
          <Image src={CreateDaoImage} />
        </ImageContainer>
        <InputTitle>DAO Name</InputTitle>
        <Controller
          name="daoName"
          control={control}
          defaultValue=""
          rules={{ required: 'This is required.' }}
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
        <SwitchRow>
          <OptionText>{'Create new token'}</OptionText>
          <div style={{ marginTop: '-12px' }}>
            <Controller
              name="isExistingToken"
              control={control}
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <BlueSwitch onChange={onChange} value={value} />
              )}
            />
          </div>
          <OptionText>{'Use existing token'}</OptionText>
        </SwitchRow>
        {!watch('isExistingToken') ? (
          <div>
            <InputTitle>Token</InputTitle>
            <ContentRow>
              <Controller
                name="tokenName"
                control={control}
                defaultValue=""
                shouldUnregister={!watch('isExistingToken')}
                rules={{ required: 'This is required.' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <InputField
                    label={''}
                    onInputChange={onChange}
                    height="46px"
                    // width="200px"
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
                shouldUnregister={!watch('isExistingToken')}
                rules={{
                  required: 'This is required.',
                  maxLength: {
                    value: 6,
                    message: 'Only 6 character is allowed.',
                  },
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <InputField
                    label={''}
                    onInputChange={onChange}
                    height="46px"
                    // width="200px"
                    placeholder={"Your Token's Symbol?"}
                    value={value}
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </ContentRow>
          </div>
        ) : (
          <div>
            <InputTitle>Token Address</InputTitle>
            <Controller
              name="tokenAddress"
              control={control}
              defaultValue=""
              shouldUnregister={watch('isExistingToken')}
              rules={{
                required: 'This is required.',
                validate: async (value) => await validateToken(value, provider),
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                  label={''}
                  onInputChange={onChange}
                  height="46px"
                  width="451px"
                  placeholder={'Please insert ERC20 token address address'}
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
          <OptionText>
            Use{' '}
            <a href={PROXY_CONTRACT_URL} target="_blank" rel="noreferrer noopener">
              Proxies
            </a>{' '}
            for the deployment - This will enable your DAO to use the already deployed code of the
            Govern Executer and Queue, and heavily decrease gas costs for your DAO deployment.
          </OptionText>
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
          <OptionText>
            Use{' '}
            <a href={ARAGON_VOICE_URL[connectedChainId]} target="_blank" rel="noreferrer noopener">
              Aragon Voice
            </a>{' '}
            - This will enable your DAO to have free voting for you proposals
          </OptionText>
        </div>
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <ANButton
            disabled={!isConnected}
            label="Create new DAO"
            buttonType="primary"
            style={{ marginTop: 40 }}
            onClick={handleSubmit(submitCreateDao)}
          />
        </div>
      </ANWrappedPaper>
    </FormContainer>
  );
};

export default memo(CreateDaoForm);
