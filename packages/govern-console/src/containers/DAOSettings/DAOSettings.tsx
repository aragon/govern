/* eslint-disable */
import React, { useState, memo, useRef, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ANWrappedPaper } from '../../components/WrapperPaper/ANWrapperPaper';
import backButtonIcon from '../../images/back-btn.svg';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { InputField } from 'components/InputFields/InputField';
import { ANButton } from 'components/Button/ANButton';
import { GET_DAO_BY_NAME } from '../DAO/queries';
import { useQuery } from '@apollo/client';
import { buildContainer } from '../../utils/ERC3000';
import { useWallet } from 'AugmentedWallet';
import { HelpButton } from 'components/HelpButton/HelpButton';
import { BlueSwitch } from 'components/Switchs/BlueSwitch';
import Grid from '@material-ui/core/Grid';
import { DaoConfig } from '@aragon/govern';
import QueueApprovals from 'services/QueueApprovals';
import { CustomTransaction } from 'utils/types';
import {
  ActionTypes,
  ModalsContext,
  closeTransactionsModalAction,
} from 'containers/HomePage/ModalsContext';
import { correctDecimal } from 'utils/token';
import FacadeProposal from 'services/Proposal';
import { useForm, Controller } from 'react-hook-form';
import { BytesLike, ContractReceipt } from 'ethers';
import { validateToken, validateContract } from '../../utils/validations';
import {
  Proposal,
  ProposalOptions,
  ReceiptType,
} from '@aragon/govern';
import { toUtf8Bytes, toUtf8String } from '@ethersproject/strings';
import { proposalDetailsUrl } from 'utils/urls';

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
  isRuleFile: BytesLike;
  isProofFile: string;
}

const SettingsContainer = styled('div')({
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
})

const BackButton = styled('div')({
  height: 25,
  width: 62,
  cursor: 'pointer',
  position: 'relative',
  left: -6,
});

const Title = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 28,
  lineHeight: '38px',
  color: '#20232C',
  marginTop: 17,
  width: 'fit-content',
  height: 50,
  display: 'flex',
  justifyContent: 'start',
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

const InputSubTitle = styled(Typography)({
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

const OptionTextStyle = styled('div')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 18,
});

const DaoSettings: React.FC<DaoSettingFormProps> = 
  ({ onClickBack }) => {
    const history = useHistory();

    const context: any = useWallet();
    const { account, status, isConnected, provider } = context;

    const { dispatch } = React.useContext(ModalsContext);

    const { control, watch, setValue, getValues, handleSubmit } = useForm<FormInputs>();

    const { daoName } = useParams<ParamTypes>();
    //TODO daoname empty handling
    const { data: daoList } = useQuery(GET_DAO_BY_NAME, {
      variables: { name: daoName },
    });

    const [daoDetails, updateDaoDetails] = useState<any>();
    const [config, setConfig] = useState<any>(undefined);
    
    useEffect(() => {
      if (daoList) {
        updateDaoDetails(daoList.daos[0]);
      }
    }, [daoList]);

    const proposalInstance = React.useMemo(() => {
      if (provider && account && daoDetails) {
        let queueApprovals = new QueueApprovals(
          account,
          daoDetails.queue.address,
          daoDetails.queue.config.resolver,
        );
        const proposal = new Proposal(
          daoDetails.queue.address,
          {} as ProposalOptions,
        );
        return new FacadeProposal(queueApprovals, proposal) as FacadeProposal &
          Proposal;
      }
    }, [provider, account, daoDetails]);

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
        if (daoDetails && provider && !config) {
          const _config = daoDetails.queue.config;
          setConfig(_config);

          // copy the nested objects so we can change the amount values
          const formConfig: DaoConfig = {
            ..._config,
            scheduleDeposit: { ..._config.scheduleDeposit },
            challengeDeposit: { ..._config.challengeDeposit },
          };

          // TODO: We only allow ordinary strings/text types for the rules settings
          // in the future, toUtf8String won't be correct and need to handle different types
          // mostly (toUTF8string again + ipfs)
          formConfig.rules = toUtf8String(_config.rules);

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
    }, [daoDetails, provider]);

    const callSaveSetting = async (formData: FormInputs) => {
      console.log('formData', formData)
      const newConfig: DaoConfig = formData.daoConfig;
      let containerHash: string | undefined;
      
      // modify config before sending to schedule.
      newConfig.rules = toUtf8Bytes(newConfig.rules.toString())
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

      // build the container to schedule.
      const payload = {
        submitter: account.address,
        executor: daoDetails.executor.address,
        actions: [proposalInstance?.buildAction('configure', [newConfig], 0)],
        proof: getValues('proof'),
      };

      // the final container to be sent to schedule.
      const container = buildContainer(payload, config);

      if (proposalInstance) {
        try {
          transactionsQueue.current = await proposalInstance.schedule(
            container,
          );
          console.log(transactionsQueue.current);
        } catch (error) {
          // TODO: Bhanu show (error.error.message)
          return;
        }
      }
      console.log(transactionsQueue.current);

      dispatch({
        type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
        payload: {
          transactionList: transactionsQueue.current,
          onTransactionFailure: () => {},
          onTransactionSuccess: (_, receipt: ContractReceipt) => {
            containerHash = Proposal.getContainerHashFromReceipt(receipt, ReceiptType.Scheduled);
          },
          onCompleteAllTransactions: () => {
            dispatch(closeTransactionsModalAction);
            if (containerHash) {
              history.push(proposalDetailsUrl(daoName, containerHash));
            }
          },
        },
      });
    };

    return (
      <>
      <SettingsContainer >
        <ANWrappedPaper style={{ width: window.innerWidth }}>
          <BackButton onClick={onClickBack}>
            <img src={backButtonIcon} />
          </BackButton>
          <Title style={{ fontSize: '38px' }}>DAO Settings</Title>
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
            rules={{ required: 'This is required.'}}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                type='number'
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
            Action collateral
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
                rules={{ required: 'This is required.', validate: async (value) =>
                  await validateToken(value, provider),
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
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
                rules={{ required: 'This is required.'}}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <InputField
                    type='number'
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
                rules={{ required: 'This is required.', validate: async (value) =>
                  await validateToken(value, provider),
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
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
                rules={{ required: 'This is required.'}}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <InputField
                    type='number'
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
            Resolver contract
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
            rules={{ required: 'This is required.', validate: (value) => {return validateContract(value, provider)}}}
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
          <div
            style={{
              width: 'fit-content',
              display: 'flex',
              flexDirection: 'row',
              marginTop: '23px',
              verticalAlign: 'middle',
              lineHeight: '40px',
            }}
          >
            {/* <OptionTextStyle>{'Text'}</OptionTextStyle>
            TODO: add this when the IPFS support kicks in
            <div style={{ marginLeft: '20px' }}>
              <Controller
                name="isRuleFile"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <BlueSwitch onChange={onChange} value={value} />
                )}
              />
            </div>
            <OptionTextStyle>{'File'}</OptionTextStyle> */}
          </div>
          <InputSubTitle>
            Provide the base rules under what your DAO should be ran
          </InputSubTitle>
          {!watch('isRuleFile') ? (
            <Controller
              name="daoConfig.rules"
              control={control}
              defaultValue={''}
              rules={{ required: 'This is required.'}}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <InputField
                  label=""
                  onInputChange={onChange}
                  value={value.toString()}
                  height={'100px'}
                  width={'100%'}
                  placeholder={'DAO rules and agreement ...'}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          ) : (
            <div
              style={{
                width: 'inherited',
                display: 'flex',
                flexDirection: 'row',
                verticalAlign: 'middle',
                lineHeight: '40px',
                marginTop: '17px',
              }}
            >
              <InputField
                label=""
                onInputChange={() => {}}
                value={''}
                height="46px"
                width="540px"
                placeholder={'Select A file...'}
              />
              <ANButton
                label={'Examine'}
                buttonType={'secondary'}
                backgroundColor={'#FFFFFF'}
                buttonColor={'#20232C'}
                onClick={() => {}}
                style={{ marginLeft: '10px' }}
                disabled={true}
              />
            </div>
          )}

          <InputTitle>
            Proof{' '}
            <HelpButton
              helpText={
                'Please provide the reasons for this DAO settings change as this will trigger an action on the executor queue'
              }
            />
          </InputTitle>
          <div
            style={{
              width: 'fit-content',
              display: 'flex',
              flexDirection: 'row',
              marginTop: '23px',
              verticalAlign: 'middle',
              lineHeight: '40px',
            }}
          >
            {/* <OptionTextStyle>{'Text'}</OptionTextStyle>
            TODO: add this when the IPFS support kicks in
            <div style={{ marginLeft: '20px' }}>
              <Controller
                name="isProofFile"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <BlueSwitch onChange={onChange} value={value} />
                )}
              />
            </div>
            <OptionTextStyle>{'File'}</OptionTextStyle> */}
          </div>
          <InputSubTitle>Enter the proof for changes</InputSubTitle>
          {!watch('isProofFile') ? (
            <Controller
              name="proof"
              control={control}
              defaultValue={''}
              rules={{ required: 'This is required.'}}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <InputField
                  label=""
                  onInputChange={onChange}
                  value={value}
                  height={'100px'}
                  width={'100%'}
                  placeholder={'DAO rules and agreement ...'}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          ) : (
            <div
              style={{
                width: 'inherited',
                display: 'flex',
                flexDirection: 'row',
                verticalAlign: 'middle',
                lineHeight: '40px',
                marginTop: '17px',
              }}
            >
              <InputField
                label=""
                onInputChange={() => {}}
                value={''}
                height="46px"
                width="540px"
                placeholder={'Select A file...'}
              />
              <ANButton
                label={'Examine'}
                buttonType={'secondary'}
                backgroundColor={'#FFFFFF'}
                buttonColor={'#20232C'}
                onClick={() => {}}
                style={{ marginLeft: '10px' }}
                disabled={true}
              />
            </div>
          )}

          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <ANButton
              label={'Save settings'}
              disabled={!isConnected}
              buttonType={'primary'}
              onClick={handleSubmit(callSaveSetting)}
              style={{ marginTop: '34px' }}
              width={'100%'}
            />
          </div>
        </ANWrappedPaper>
        </SettingsContainer>
      </>
    )
  }


export default memo(DaoSettings);
