import React, { useState, memo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ANWrappedPaper } from 'components/WrapperPaper/ANWrapperPaper';
import backButtonIcon from '../../images/back-btn.svg';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { InputField } from 'components/InputFields/InputField';
import { ANButton } from 'components/Button/ANButton';
import { buildContainer } from 'utils/ERC3000';
import { useWallet } from 'AugmentedWallet';
import { HelpButton } from 'components/HelpButton/HelpButton';
import Grid from '@material-ui/core/Grid';
import { DaoConfig } from '@aragon/govern';
import { CustomTransaction } from 'utils/types';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { correctDecimal } from 'utils/token';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { ContractReceipt } from 'ethers';
import { validateToken, validateContract } from 'utils/validations';
import { Proposal, ProposalOptions, ReceiptType } from '@aragon/govern';
import { useSnackbar } from 'notistack';
import { toUTF8Bytes, toUTF8String } from 'utils/lib';
import { proposalDetailsUrl } from 'utils/urls';
import { getIpfsUrl, addToIpfs } from 'utils/ipfs';
import { IPFSInput } from 'components/Field/IPFSInput';
import { useFacadeProposal } from 'hooks/proposals';
import { useDaoSubscription } from 'hooks/subscription-hooks';

export interface DaoSettingFormProps {
  /**
   * on click back
   */
  onClickBack: () => void;
}

interface ParamTypes {
  /**
   * type of path (url) params
   */
  daoName: string;
}

interface FormInputs {
  daoConfig: DaoConfig;
  proof: string;
  rulesFile: any;
  proofFile: any;
}

const SettingsContainer = styled('div')({
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
});

const BackButton = styled('div')({
  height: 25,
  width: 62,
  cursor: 'pointer',
  position: 'relative',
  left: -6,
});

// TODO: GIORGI repeating styles
const Title = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 28,
  lineHeight: '38px',
  color: '#20232C',
  marginTop: 17,
  height: 50,
  display: 'block',
});

const InputTitle = styled(Typography)({
  width: 'fit-content',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 28,
  lineHeight: '25px',
  color: '#20232C',
  marginTop: '17px',
});

export const InputSubTitle = styled(Typography)({
  width: 'fit-content',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
  marginTop: '17px',
  marginBottom: '17px',
});

const DaoSettings: React.FC<DaoSettingFormProps> = ({ onClickBack }) => {
  const history = useHistory();
  const context: any = useWallet();
  const { account, isConnected, provider } = context;

  const { dispatch } = React.useContext(ModalsContext);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormInputs>();
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { daoName } = useParams<ParamTypes>();
  //TODO daoname empty handling

  // TODO: Giorgi useDaoSubscription should be returning the single object
  // we shouldn't be doing daoList.daos[0]
  const { data: daoList } = useDaoSubscription(daoName);

  const [daoDetails, updateDaoDetails] = useState<any>();
  const [config, setConfig] = useState<any>(undefined);
  const [rulesIpfsUrl, setRulesIpfsUrl] = useState<string>('');

  useEffect(() => {
    if (daoList) {
      updateDaoDetails(daoList.daos[0]);
    }
  }, [daoList]);

  const proposalInstance = useFacadeProposal(
    daoDetails?.queue.address,
    daoDetails?.queue.config.resolver,
  );

  const transactionsQueue = React.useRef<CustomTransaction[]>([]);

  useEffect(() => {
    return function cleanUp() {
      transactionsQueue.current = [];
    };
  }, []);

  useEffect(() => {
    const _load = async () => {
      // config is also used as a check in order to set and populate
      // the UI with current Dao's config only once
      if (daoDetails && provider && !config && setValue) {
        const _config = daoDetails.queue.config;
        setConfig(_config);

        // copy the nested objects so we can change the amount values
        const formConfig: DaoConfig = {
          ..._config,
          scheduleDeposit: { ..._config.scheduleDeposit },
          challengeDeposit: { ..._config.challengeDeposit },
        };

        // config.rules IPFS handling with utf8string fallback.
        const rulesIpfsUrl = getIpfsUrl(_config.rules);
        if (rulesIpfsUrl) {
          setRulesIpfsUrl(rulesIpfsUrl);
          formConfig.rules = '';
        } else {
          formConfig.rules = toUTF8String(_config.rules) || _config.rules;
        }

        formConfig.scheduleDeposit.amount = await correctDecimal(
          _config.scheduleDeposit.token,
          _config.scheduleDeposit.amount,
          false,
          provider,
        );
        formConfig.challengeDeposit.amount = await correctDecimal(
          _config.challengeDeposit.token,
          _config.challengeDeposit.amount,
          false,
          provider,
        );

        setValue('daoConfig', formConfig);
      }
    };
    _load();
  }, [daoDetails, provider, config, setValue]);

  const callSaveSetting = async (formData: FormInputs) => {
    const newConfig: DaoConfig = formData.daoConfig;
    let containerHash: string | undefined;

    // TODO: add modal
    // Upload proof to ipfs if it's a file,
    // otherwise convert it to utf8bytes
    const rulesFile = getValues('rulesFile');
    newConfig.rules = rulesFile
      ? await addToIpfs(rulesFile[0])
      : toUTF8Bytes(newConfig.rules.toString());

    newConfig.scheduleDeposit.amount = await correctDecimal(
      newConfig.scheduleDeposit.token,
      newConfig.scheduleDeposit.amount,
      true,
      provider,
    );
    newConfig.challengeDeposit.amount = await correctDecimal(
      newConfig.challengeDeposit.token,
      newConfig.challengeDeposit.amount,
      true,
      provider,
    );

    // TODO: add modal
    // Upload proof to ipfs if it's a file,
    // otherwise convert it to utf8bytes
    const proofFile = getValues('proofFile');
    const proof = proofFile ? await addToIpfs(proofFile[0]) : toUTF8Bytes(getValues('proof'));

    // payload for the final container
    const payload = {
      submitter: account.address,
      executor: daoDetails.executor.address,
      actions: [proposalInstance?.buildAction('configure', [newConfig], 0)],
      proof: proof,
    };

    // the final container to be sent to schedule.
    const container = buildContainer(payload, config);

    if (proposalInstance) {
      try {
        transactionsQueue.current = await proposalInstance.schedule(container);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
    }

    dispatch({
      type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
      payload: {
        transactionList: transactionsQueue.current,
        onTransactionFailure: (error) => {
          enqueueSnackbar(error, { variant: 'error' });
        },
        onTransactionSuccess: (_, receipt: ContractReceipt) => {
          containerHash = Proposal.getContainerHashFromReceipt(receipt, ReceiptType.Scheduled);
        },
        onCompleteAllTransactions: () => {
          if (containerHash) {
            history.push(proposalDetailsUrl(daoName, containerHash));
          }
        },
      },
    });
  };

  return (
    <>
      <SettingsContainer>
        <ANWrappedPaper style={{ width: window.innerWidth }}>
          <BackButton onClick={() => history.goBack()}>
            <img src={backButtonIcon} />
          </BackButton>
          <Title style={{ fontSize: '38px' }}>DAO Settings</Title>
          <FormProvider {...methods}>
            <InputTitle>
              Execution Delay{' '}
              <HelpButton
                helpText={
                  'The amount of time any action will be delayed before it can be executed. During this time anyone can challenge it, preventing its execution'
                }
              />
            </InputTitle>
            <InputSubTitle>In seconds</InputSubTitle>
            <Controller
              name="daoConfig.executionDelay"
              control={control}
              defaultValue={''}
              rules={{ required: 'This is required.' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                  type="number"
                  label=""
                  onInputChange={onChange}
                  value={value.toString()}
                  height="46px"
                  width={window.innerWidth > 700 ? '50%' : '100%'}
                  placeholder={'350s'}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <InputTitle>
              Action collateral{' '}
              <HelpButton
                helpText={
                  'The requested collateral to be staked when anyone is scheduling an action. This is required so if action is challenged, collateral is used in resolver contract. If action passes, collateral returns to owner.'
                }
              />
            </InputTitle>
            <Grid container spacing={3}>
              <Grid item>
                <InputSubTitle>Token contract address</InputSubTitle>
                <Controller
                  name="daoConfig.scheduleDeposit.token"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'This is required.',
                    validate: async (value) => await validateToken(value, provider),
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <InputField
                      label=""
                      onInputChange={onChange}
                      value={value}
                      height="46px"
                      width={window.innerWidth > 700 ? '540px' : '100%'}
                      placeholder={'350s'}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <InputSubTitle>Amount</InputSubTitle>
                <Controller
                  name="daoConfig.scheduleDeposit.amount"
                  control={control}
                  defaultValue={''}
                  rules={{ required: 'This is required.' }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <InputField
                      type="number"
                      label=""
                      onInputChange={onChange}
                      value={value.toString()}
                      height="46px"
                      width={window.innerWidth > 700 ? '540px' : '100%'}
                      placeholder={'350s'}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <InputTitle>
              Challenge collateral{' '}
              <HelpButton
                helpText={
                  'The requested collateral to be staked when anyone challenges a scheduled action. This is required to be used in the dispute on a resolver contract. If challenge wins the dispute, collateral returns to owner.'
                }
              />
            </InputTitle>
            <Grid container spacing={3}>
              <Grid item>
                <InputSubTitle>Token contract address</InputSubTitle>
                <Controller
                  name="daoConfig.challengeDeposit.token"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'This is required.',
                    validate: async (value) => await validateToken(value, provider),
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <InputField
                      label=""
                      onInputChange={onChange}
                      value={value}
                      height="46px"
                      width={window.innerWidth > 700 ? '540px' : '100%'}
                      placeholder={'350s'}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputSubTitle>Amount</InputSubTitle>
                <Controller
                  name="daoConfig.challengeDeposit.amount"
                  control={control}
                  defaultValue={''}
                  rules={{ required: 'This is required.' }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <InputField
                      type="number"
                      label=""
                      onInputChange={onChange}
                      value={value.toString()}
                      height="46px"
                      width={window.innerWidth > 700 ? '540px' : '100%'}
                      placeholder={'350s'}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <InputTitle>
              Resolver contract{' '}
              <HelpButton
                helpText={
                  'A resolver contract is used to handle any disputes of the DAO. This contract needs to implement the AragonCourt interface - https://github.com/aragon/protocol/blob/development/packages/evm/contracts/AragonCourt.sol'
                }
              />
            </InputTitle>
            <InputSubTitle>Contract address</InputSubTitle>
            <Controller
              name="daoConfig.resolver"
              control={control}
              defaultValue={''}
              rules={{
                required: 'This is required.',
                validate: (value) => {
                  return validateContract(value, provider);
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                  label=""
                  onInputChange={onChange}
                  value={value}
                  height="46px"
                  width={window.innerWidth > 700 ? '540px' : '100%'}
                  placeholder={'350s'}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <InputTitle>
              DAO rules / agreement{' '}
              <HelpButton
                helpText={
                  'Please provide the base rules under what your DAO should be ran. This is a human readable document that can guide anyone on what are the accepted behaviours when being part and interacting with this DAO.'
                }
              />
            </InputTitle>

            <IPFSInput
              label="Provide the base rules under what your DAO should be ran"
              placeholder="DAO rules and agreement.."
              ipfsURI={rulesIpfsUrl}
              textInputName="daoConfig.rules"
              fileInputName="rulesFile"
            />

            <InputTitle>
              Justification{' '}
              <HelpButton
                helpText={
                  'Please provide the reasons for this DAO settings change as this will trigger an action on the executor queue'
                }
              />
            </InputTitle>
            <IPFSInput
              label="Enter the justification for changes"
              placeholder="Justification Reason..."
              textInputName="proof"
              fileInputName="proofFile"
            />

            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <ANButton
                disabled={!isConnected}
                label={'Save settings'}
                buttonType={'primary'}
                onClick={handleSubmit(callSaveSetting)}
                style={{ marginTop: '34px' }}
                width={'100%'}
              />
            </div>
          </FormProvider>
        </ANWrappedPaper>
      </SettingsContainer>
    </>
  );
};

export default memo(DaoSettings);
