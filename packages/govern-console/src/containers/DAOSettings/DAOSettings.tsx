/* eslint-disable */
import React, { useState, memo, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ANWrappedPaper } from 'components/WrapperPaper/ANWrapperPaper';
import backButtonIcon from '../../images/back-btn.svg';
import { useTheme, styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { InputField } from '../../components/InputFields/InputField';
import TextArea from 'components/TextArea/TextArea';
import { ANButton } from 'components/Button/ANButton';
// import Modal from '@material-ui/core/Modal';
import { SimpleModal } from '../../components/Modal/SimpleModal';
import { ANCircularProgressWithCaption } from '../../components/CircularProgress/ANCircularProgressWithCaption';
import { CiruclarProgressStatus } from 'utils/types';
import { GET_DAO_BY_NAME } from '../DAO/queries';
import { useQuery } from '@apollo/client';
import { buildPayload } from '../../utils/ERC3000';
import { useWallet } from '../../EthersWallet';
import { erc20ApprovalTransaction } from '../../utils/transactionHelper';
import { toUtf8Bytes } from '@ethersproject/strings';
import { HelpButton } from '../../components/HelpButton/HelpButton';
import { BlueSwitch } from '../../components/Switchs/BlueSwitch';
import Grid from '@material-ui/core/Grid';

import {
  Proposal,
  ProposalOptions,
  PayloadType,
  ActionType,
} from '@aragon/govern';

export interface DaoSettingContainerProps {
  /**
   * on click back
   */
  onClickBack: () => void;
}

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

const RuleTextArea = styled(TextArea)({
  background: '#FFFFFF',
  border: '2px solid #EFF1F7',
  boxSizing: 'border-box',
  boxShadow: 'inset 0px 2px 3px 0px rgba(180, 193, 228, 0.35)',
  borderRadius: '8px',
  width: '100%',
  height: 104,
  padding: '11px 21px',
  fontSize: 18,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '25px',
  letterSpacing: '0em',
  // border: '0 !important',
  '& .MuiInputBase-root': {
    border: 0,
    width: '100%',
    input: {
      width: '100%',
    },
  },
  '& .MuiInput-underline:after': {
    border: 0,
  },
  '& .MuiInput-underline:before': {
    border: 0,
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    border: 0,
  },
});

const DaoSettingsForm: React.FC<DaoSettingFormProps> = memo(
  ({ onClickBack }) => {
    const context: any = useWallet();
    const {
      // connector,
      account,
      // balance,
      // chainId,
      // connect,
      // connectors,
      // ethereum,
      // error,
      // getBlockNumber,
      // networkName,
      // reset,
      // status,
      // type,
      ethersProvider,
    } = context;

    const [executionDelay, updateExecutionDelay] = useState<string>('');

    const scheduleDepositContractAddress = useRef<string>('');
    const scheduleDepositAmount = useRef<string>('');
    const challengeDepositContractAddress = useRef<string>('');
    const challengeDepositAmount = useRef<string>('');
    const resolverAddress = useRef<string>('');
    const rules = useRef<string>();
    const justification = useRef<string>('');

    const [isRuleFile, setIsRuleFile] = useState(false);
    const [isJustificationFile, setIsJustificationFile] = useState(false);

    const onChangeExecutionDelay = (val: any) => {
      // setExecutionDelay(val)
      updateExecutionDelay(val);
    };

    const onScheduleDepositContractAddress = (val: any) => {
      // setScheduleDepositContractAddress(val)
      scheduleDepositContractAddress.current = val;
    };

    const onChangeScheduleDepositAmount = (val: any) => {
      // setScheduleDepositAmount(val)
      scheduleDepositAmount.current = val;
    };

    const onChangeChallengeDepositContractAddress = (val: any) => {
      // setChallengeDepositContractAddress(val)
      challengeDepositContractAddress.current = val;
    };

    const onChangeChallengeDepositAmount = (val: any) => {
      // setChallengeDepositAmoun(val)
      challengeDepositAmount.current = val;
    };

    const onChangeResolverAddress = (val: any) => {
      // setResolverAddress(val)
      resolverAddress.current = val;
    };

    const onChangeRules = (val: any) => {
      // setRules(val)
      rules.current = val;
    };

    const onChangeJustification = (val: any) => {
      // setJustification(val)
      justification.current = val;
    };

    const { daoName } = useParams<ParamTypes>();
    //TODO daoname empty handling
    const { data: daoList } = useQuery(GET_DAO_BY_NAME, {
      variables: { name: daoName },
    });

    const [daoDetails, updateDaoDetails] = useState<any>();
    const [proposal, setProposal] = useState<any | null>();
    const [currentConfig, setCurrentConfig] = useState<any | null>();

    useEffect(() => {
      if (daoList) {
        updateDaoDetails(daoList.daos[0]);
      }
    }, [daoList]);

    useEffect(() => {
      console.log('daoDetails', daoDetails);
      if (daoDetails) {
        const _config = daoDetails.queue.config;
        console.log('_config', _config);
        setCurrentConfig(_config);
        onChangeExecutionDelay(_config.executionDelay);
        onScheduleDepositContractAddress(_config.scheduleDeposit.token);
        onChangeScheduleDepositAmount(_config.scheduleDeposit.amount);
        onChangeChallengeDepositContractAddress(_config.challengeDeposit.token);
        onChangeChallengeDepositAmount(_config.challengeDeposit.amount);
        onChangeResolverAddress(_config.resolver);
        onChangeRules(_config.rules);

        const proposalOptions: ProposalOptions = {};
        const proposal = new Proposal(
          daoDetails.queue.address,
          proposalOptions,
        );
        setProposal(proposal);
      }
    }, [daoDetails]);

    const [isOpen, setIsOpen] = useState(false);
    const [txList, setTxList] = useState<string[]>([]);
    const [isTrigger, setIsTrigger] = useState<boolean>(false);

    const closeModal = () => {
      setIsOpen(!isOpen);
    };

    const callSaveSetting = async () => {
      const newConfig = {
        executionDelay: executionDelay,
        scheduleDeposit: {
          token: scheduleDepositContractAddress.current,
          amount: scheduleDepositAmount.current,
        },
        challengeDeposit: {
          token: challengeDepositContractAddress.current,
          amount: challengeDepositAmount.current,
        },
        resolver: resolverAddress.current,
        rules: rules.current,
        maxCalldataSize: currentConfig.maxCalldataSize, // TODO: grab it from config subgraph too.
      };

      console.log(newConfig, ' config');

      const submitter: string = account;

      const payload = buildPayload({
        submitter,
        executor: daoDetails.executor.address,
        actions: [proposal.buildAction('configure', [newConfig], 0)],
        executionDelay: daoDetails.queue.config.executionDelay,
        proof: toUtf8Bytes(justification.current), // TODO Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
        // proof: '0x',
      });
      console.log(payload, ' payload');

      // TODO:GIORGI error tracking make it better
      if (
        daoDetails.queue.config.scheduleDeposit.token !==
        '0x' + '0'.repeat(20)
      ) {
        const scheduleDepositApproval = await erc20ApprovalTransaction(
          daoDetails.queue.config.scheduleDeposit.token,
          daoDetails.queue.config.scheduleDeposit.amount,
          daoDetails.queue.address,
          ethersProvider,
          account,
        );

        if (scheduleDepositApproval.error) {
          console.log(scheduleDepositApproval.error, ' approval error');
        }

        if (scheduleDepositApproval.transactions.length > 0) {
          try {
            const transactionResponse: any = await scheduleDepositApproval.transactions[0].tx();
            await transactionResponse.wait();
          } catch (err) {
            console.log(err);
          }
        }
      }

      console.log(currentConfig, ' nice one');
      const scheduleResult = await proposal.schedule({
        payload: payload,
        config: currentConfig,
      });

      // TODO: create tx object with attribute such as if tx is done using CiruclarProgressStatus
      // console.log('current input obj:', obj);
      // setTxList(['Transaction details 01', 'Transaction details 02']);
      setIsOpen(true);
    };

    const txReviewContainer = (
      <div
        style={{
          minWidth: '398px',
          minHeight: '124px',
          background: '#F6F9FC',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            fontFamily: 'Manrope',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '19px',
            color: '#0176FF',
            marginTop: '20px',
            marginLeft: '20px',
            marginBottom: '10px',
          }}
        >
          Transactions to be triggered:
        </div>
        {txList.map((tx) => {
          return (
            <div
              style={{
                fontFamily: 'Manrope',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '22px',
                color: '#0176FF',
                marginLeft: '30px',
              }}
            >
              {'● ' + tx}
            </div>
          );
        })}
      </div>
    );

    const txTrigerContainer = (
      <div
        style={{
          minWidth: '398px',
          minHeight: '124px',
          background: '#F6F9FC',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            fontFamily: 'Manrope',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '19px',
            color: '#0176FF',
            marginTop: '20px',
            marginLeft: '20px',
            marginBottom: '10px',
          }}
        >
          Processing transactions
        </div>
        {txList.map((tx) => {
          return (
            <div
              style={{
                fontFamily: 'Manrope',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '22px',
                color: '#0176FF',
                marginLeft: '30px',
              }}
            >
              <ANCircularProgressWithCaption
                state={CiruclarProgressStatus.Disabled}
                caption={tx}
              />
            </div>
          );
        })}
      </div>
    );

    const modalContainer = (
      <div>
        {isTrigger ? txTrigerContainer : txReviewContainer}
        <ANButton
          label={isTrigger ? 'Continue' : 'Get started'}
          type={'primary'}
          onClick={
            isTrigger
              ? () => console.log('call package')
              : () => setIsTrigger(true)
          }
          style={{ marginTop: '34px' }}
          width={'100%'}
        />
      </div>
    );

    return proposal ? (
      <>
        <SimpleModal
          modalTitle={'Confirm transactions'}
          open={isOpen}
          onClose={closeModal}
          children={modalContainer}
        />
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
          <InputField
            label=""
            onInputChange={onChangeExecutionDelay}
            value={executionDelay}
            height="46px"
            width={window.innerWidth > 700 ? '50%' : '100%'}
            placeholder={'350s'}
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
              <InputField
                label=""
                onInputChange={onScheduleDepositContractAddress}
                value={scheduleDepositContractAddress.current}
                height="46px"
                minWidth={window.innerWidth > 700 ? '540px' : '100%'}
                placeholder={'0x0000...'}
              />
            </Grid>
            <Grid item>
              <InputSubTitle>Amount</InputSubTitle>
              <InputField
                label=""
                onInputChange={onChangeScheduleDepositAmount}
                value={scheduleDepositAmount.current}
                height="46px"
                minWidth={window.innerWidth > 700 ? '540px' : '100%'}
                placeholder={'150'}
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
              <InputField
                label=""
                onInputChange={onChangeChallengeDepositContractAddress}
                value={challengeDepositContractAddress.current}
                height="46px"
                width={window.innerWidth > 700 ? '540px' : '100%'}
                placeholder={'0x4c495F0005171E17c1dd08510g801805eE08E7'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputSubTitle>Amount</InputSubTitle>
              <InputField
                label=""
                onInputChange={onChangeChallengeDepositAmount}
                value={challengeDepositAmount.current}
                height="46px"
                width={window.innerWidth > 700 ? '540px' : '100%'}
                placeholder={'350'}
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
          <InputSubTitle>Token contract address</InputSubTitle>
          <InputField
            label=""
            onInputChange={onChangeResolverAddress}
            value={resolverAddress.current}
            height="46px"
            width={window.innerWidth > 700 ? '540px' : '100%'}
            placeholder={'0x4c495F0005171E17c1dd08510g801805eE08E7'}
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
            <OptionTextStyle>{'Text'}</OptionTextStyle>
            <div style={{ marginLeft: '20px' }}>
              <BlueSwitch
                disabled={true}
                checked={isRuleFile}
                onChange={() => {
                  setIsRuleFile(!isRuleFile);
                }}
                name="ruleCheck"
              />
            </div>
            <OptionTextStyle>{'File'}</OptionTextStyle>
          </div>
          <InputSubTitle>
            Provide the base rules under what your DAO should be ran
          </InputSubTitle>
          {!isRuleFile ? (
            // <RuleTextArea onChange={onChangeRules} value={rules.current} />
            <InputField
              label=""
              onInputChange={onChangeRules}
              value={rules.current}
              height="46px"
              width="540px"
              placeholder={'DAO rules and agreement ...'}
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
                type={'secondary'}
                backgroundColor={'#FFFFFF'}
                color={'#20232C'}
                onClick={() => {}}
                style={{ marginLeft: '10px' }}
                disabled={true}
              />
            </div>
          )}

          <InputTitle>
            Justification{' '}
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
            <OptionTextStyle>{'Text'}</OptionTextStyle>
            <div style={{ marginLeft: '20px' }}>
              <BlueSwitch
                disabled={true}
                checked={isJustificationFile}
                onChange={() => {
                  setIsJustificationFile(!isJustificationFile);
                }}
                name="ruleCheck"
              />
            </div>
            <OptionTextStyle>{'File'}</OptionTextStyle>
          </div>
          <InputSubTitle>Enter the justification for changes</InputSubTitle>
          {!isJustificationFile ? (
            // <RuleTextArea
            //   onChange={onChangeJustification}
            //   value={justification}
            // />
            <InputField
              label=""
              onInputChange={onChangeJustification}
              value={justification.current}
              height="46px"
              width="540px"
              placeholder={'Justification...'}
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
                type={'secondary'}
                backgroundColor={'#FFFFFF'}
                color={'#20232C'}
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
              type={'primary'}
              onClick={callSaveSetting}
              style={{ marginTop: '34px' }}
              width={'100%'}
            />
          </div>
        </ANWrappedPaper>
      </>
    ) : null;
  },
);

const DaoSettingsContainer: React.FC<DaoSettingContainerProps> = ({
  onClickBack,
}) => {
  return (
    <div
      style={{
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DaoSettingsForm onClickBack={onClickBack} />
    </div>
  );
};

export default DaoSettingsContainer;
