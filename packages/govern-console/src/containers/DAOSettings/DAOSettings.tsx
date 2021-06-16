import React, { useState, memo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import backButtonIcon from '../../images/back-btn.svg';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { InputField } from 'components/InputFields/InputField';
import { buildConfig } from 'utils/ERC3000';
import { useWallet } from 'AugmentedWallet';
import { HelpButton } from 'components/HelpButton/HelpButton';
// import Grid from '@material-ui/core/Grid';
import { DaoConfig } from '@aragon/govern';
import { CustomTransaction } from 'utils/types';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { ContractReceipt } from 'ethers';
import { validateToken, validateContract, validateAmountForDecimals } from 'utils/validations';
import { Proposal, ReceiptType } from '@aragon/govern';
import { useSnackbar } from 'notistack';
import { toUTF8String } from 'utils/lib';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs, fetchIPFS } from 'utils/ipfs';
import { IPFSInput } from 'components/Field/IPFSInput';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { useDaoQuery } from 'hooks/query-hooks';
import { ipfsMetadata } from 'utils/types';
import { formatUnits, parseUnits } from 'utils/lib';
import { getTokenInfo } from 'utils/token';
import {
  useLayout,
  Grid,
  GridItem,
  Accordion,
  TextInput,
  TextCopy,
  Box,
  Button,
  StyledText,
  SPACING,
} from '@aragon/ui';

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

const BackButton = styled('div')({
  height: 25,
  width: 62,
  cursor: 'pointer',
  position: 'relative',
  left: 0,
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

const DaoSettings: React.FC<DaoSettingFormProps> = () => {
  const { layoutName } = useLayout();
  const history = useHistory();
  const context: any = useWallet();
  const { account, isConnected, provider } = context;

  const { dispatch } = React.useContext(ModalsContext);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormInputs>();
  const { control, setValue, getValues, handleSubmit, trigger } = methods;

  const { daoName } = useParams<ParamTypes>();
  //TODO daoname empty handling

  const { data: dao } = useDaoQuery(daoName);

  const [daoDetails, updateDaoDetails] = useState<any>();
  const [config, setConfig] = useState<any>(undefined);
  const [daoAddresses, setDaoAddresses] = useState<{ executorAddress: string; token: string }>({
    executorAddress: '',
    token: '',
  });
  const [rulesIpfsUrl, setRulesIpfsUrl] = useState<ipfsMetadata & string>();

  const [scheduleDecimals, setScheduleDecimals] = useState<number>(0);
  const [challengeDecimals, setChallengeDecimals] = useState<number>(0);

  useEffect(() => {
    if (dao) {
      updateDaoDetails(dao);
    }
  }, [dao]);

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
        const _daoAddresses = {
          executorAddress: daoDetails.executor.address,
          token: daoDetails.token,
        };
        setConfig(_config);
        setDaoAddresses(_daoAddresses);

        // copy the nested objects so we can change the amount values
        const formConfig = buildConfig(_config);

        setScheduleDecimals(_config.scheduleDeposit.decimals);
        setChallengeDecimals(_config.challengeDeposit.decimals);

        // can/should be extracted in the transformProposals in useQuery hooks.
        formConfig.scheduleDeposit.amount = formatUnits(
          _config.scheduleDeposit.amount,
          _config.scheduleDeposit.decimals,
        );
        formConfig.challengeDeposit.amount = formatUnits(
          _config.challengeDeposit.amount,
          _config.challengeDeposit.decimals,
        );
        // config.rules IPFS handling with utf8string fallback.
        const ipfsRules = await fetchIPFS(_config.rules);
        if (ipfsRules) {
          setRulesIpfsUrl(ipfsRules);
          formConfig.rules = ipfsRules.text || '';
        } else {
          formConfig.rules = toUTF8String(_config.rules) || _config.rules;
        }

        setValue('daoConfig', formConfig);
      }
    };
    _load();
  }, [daoDetails, provider, config, setValue]);

  const callSaveSetting = async (formData: FormInputs) => {
    const newConfig: DaoConfig = formData.daoConfig;
    let containerHash: string | undefined;

    // Upload rules to ipfs
    const rules = getValues('rulesFile') ? getValues('rulesFile')[0] : newConfig.rules.toString();
    console.log(getValues('rulesFile'), ' rulesfile');
    newConfig.rules = await addToIpfs(rules);

    // Upload proof to ipfs
    const proof = getValues('proofFile') ? getValues('proofFile')[0] : getValues('proof');
    const proofCid = await addToIpfs(proof, {
      title: 'DAO Configuration change',
    });

    // if the amount contains `.`, means it's a fractional component
    // and we need to parse it to bignumber again for smart contract
    if (newConfig.scheduleDeposit.amount.toString().includes('.')) {
      newConfig.scheduleDeposit.amount = parseUnits(
        newConfig.scheduleDeposit.amount,
        scheduleDecimals,
      );
    }
    if (newConfig.challengeDeposit.amount.toString().includes('.')) {
      newConfig.challengeDeposit.amount = parseUnits(
        newConfig.challengeDeposit.amount,
        challengeDecimals,
      );
    }

    // payload for the final container
    const payload = {
      submitter: account.address,
      executor: daoDetails.executor.address,
      actions: [proposalInstance?.buildAction('configure', [newConfig], 0)],
      proof: proofCid,
    };

    if (proposalInstance) {
      try {
        transactionsQueue.current = await proposalInstance.schedule(payload, buildConfig(config));
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
    }

    dispatch({
      type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
      payload: {
        transactionList: transactionsQueue.current,
        onTransactionFailure: () => {
          /* do nothing */
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
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={'1/4'}>
        <Box>
          <BackButton onClick={() => history.goBack()}>
            <img src={backButtonIcon} />
          </BackButton>
          <StyledText name={'title1'}>DAO Settings</StyledText>
          <TextCopy title={'DAO Govern Executor Address'} value={daoAddresses.executorAddress} />
          <TextCopy title={'DAO Govern Executor Address'} value={daoAddresses.token} />
          <FormProvider {...methods}>
            <Controller
              name="daoConfig.executionDelay"
              control={control}
              defaultValue={''}
              rules={{ required: 'This is required.' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  title={'Execution Delay'}
                  subtitle={
                    'Amount of time any action in your DAO will be available to be challenged before bein executed'
                  }
                  type="number"
                  onChange={onChange}
                  value={value.toString()}
                  wide
                  placeholder={'350s'}
                  status={!!error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />

            <IPFSInput
              title={'Rules / Agreement'}
              subtitle="Your DAO have optimistic capabilities, meaning that actions can happen without voting, but should follow pre defined rules. Please provide the main agreement for your DAO (In text, or upload a file)."
              placeholder="DAO rules and agreement.."
              ipfsURI={rulesIpfsUrl?.endpoint}
              shouldUnregister={false}
              textInputName="daoConfig.rules"
              fileInputName="rulesFile"
            />
            <InputTitle>
              Action collateral{' '}
              <HelpButton
                helpText={
                  'The requested collateral to be staked when anyone is scheduling an action. This is required so if action is challenged, collateral is used in resolver contract. If action passes, collateral returns to owner.'
                }
              />
            </InputTitle>
            <div>
              <InputSubTitle>Token contract address</InputSubTitle>
              <Controller
                name="daoConfig.scheduleDeposit.token"
                control={control}
                defaultValue=""
                rules={{
                  required: 'This is required.',
                  validate: async (value) => {
                    const v = await validateToken(value, provider);
                    if (v !== true) {
                      return v;
                    }

                    let { decimals } = await getTokenInfo(value, provider);
                    decimals = decimals || 0;

                    setScheduleDecimals(decimals);
                    await trigger('daoConfig.scheduleDeposit.amount');
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
            </div>
            <div>
              <InputSubTitle>Amount</InputSubTitle>
              <Controller
                name="daoConfig.scheduleDeposit.amount"
                control={control}
                defaultValue={''}
                rules={{
                  required: 'This is required.',
                  validate: (value) => validateAmountForDecimals(value, scheduleDecimals),
                }}
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
            </div>
            <div>
              <InputTitle>
                Challenge collateral{' '}
                <HelpButton
                  helpText={
                    'The requested collateral to be staked when anyone challenges a scheduled action. This is required to be used in the dispute on a resolver contract. If challenge wins the dispute, collateral returns to owner.'
                  }
                />
              </InputTitle>
              <div>
                <InputSubTitle>Token contract address</InputSubTitle>
                <Controller
                  name="daoConfig.challengeDeposit.token"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'This is required.',
                    validate: async (value) => {
                      const v = await validateToken(value, provider);
                      if (v !== true) {
                        return v;
                      }

                      let { decimals } = await getTokenInfo(value, provider);
                      decimals = decimals || 0;

                      setChallengeDecimals(decimals);

                      await trigger('daoConfig.challengeDeposit.amount');
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
              </div>
              <div>
                <InputSubTitle>Amount</InputSubTitle>
                <Controller
                  name="daoConfig.challengeDeposit.amount"
                  control={control}
                  defaultValue={''}
                  rules={{
                    required: 'This is required.',
                    validate: (value) => validateAmountForDecimals(value, challengeDecimals),
                  }}
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
              </div>

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
                Justification{' '}
                <HelpButton
                  helpText={
                    'Please provide the reasons for this DAO settings change as this will trigger an action on the executor queue'
                  }
                />
              </InputTitle>
              <IPFSInput
                subtitle="Enter the justification for changes"
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
                <Button
                  size={layoutName}
                  disabled={!isConnected}
                  label={'Save settings'}
                  buttonType={'primary'}
                  onClick={handleSubmit(callSaveSetting)}
                  style={{ marginTop: '34px' }}
                  wide
                />
              </div>
            </div>
          </FormProvider>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default memo(DaoSettings);
