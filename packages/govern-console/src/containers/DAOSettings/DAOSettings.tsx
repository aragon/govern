/* eslint-disable */
import React, { useState, memo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ANWrappedPaper } from '../../components/WrapperPaper/ANWrapperPaper';
import backButtonIcon from '../../images/back-btn.svg';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { InputField } from 'components/InputFields/InputField';
import { ANButton } from 'components/Button/ANButton';
// import Modal from '@material-ui/core/Modal';
import { SimpleModal } from 'components/Modal/SimpleModal';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';
import { CiruclarProgressStatus } from 'utils/types';
import { GET_DAO_BY_NAME } from '../DAO/queries';
import { useQuery } from '@apollo/client';
import { buildPayload } from '../../utils/ERC3000';
import { useWallet } from '../../EthersWallet';
import { HelpButton } from 'components/HelpButton/HelpButton';
import { BlueSwitch } from 'components/Switchs/BlueSwitch';
import Grid from '@material-ui/core/Grid';
import { toUtf8Bytes, toUtf8String } from '@ethersproject/strings';
import { DaoConfig } from '@aragon/govern';
import QueueApprovals from 'services/QueueApprovals'
import { CustomTransaction } from 'utils/types';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { correctDecimal } from 'utils/token'
import  FacadeProposal from 'services/Proposal';

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
      status,
      // type,
      ethersProvider,
    } = context;

    const submitter: string = account;

    const { dispatch } = React.useContext(ModalsContext);
    
    const [executionDelay, updateExecutionDelay] = useState<string>('');

    const scheduleDepositContractAddress = useRef<string>('');
    const scheduleDepositAmount = useRef<string>('');
    const challengeDepositContractAddress = useRef<string>('');
    const challengeDepositAmount = useRef<string>('');
    const resolverAddress = useRef<string>('');
    const rules = useRef<string>('');
    const proof = useRef<string>('');

    const [isRuleFile, setIsRuleFile] = useState(false);
    const [isProofFile, setIsProofFile] = useState(false);

    const onChangeExecutionDelay = (val: any) => {
      // setExecutionDelay(val)
      updateExecutionDelay(val);
    };

    const onScheduleDepositContractAddress = (val: any) => {
      scheduleDepositContractAddress.current = val;
    };

    const onChangeScheduleDepositAmount = (val: any) => {
      scheduleDepositAmount.current = val;
    };

    const onChangeChallengeDepositContractAddress = (val: any) => {
      challengeDepositContractAddress.current = val;
    };

    const onChangeChallengeDepositAmount = (val: any) => {
      challengeDepositAmount.current = val;
    };

    const onChangeResolverAddress = (val: any) => {
      resolverAddress.current = val;
    };

    const onChangeRules = (val: any) => {
      rules.current = val;
    };

    const onChangeProof = (val: any) => {
      proof.current = val;
    };


    const { daoName } = useParams<ParamTypes>();
    //TODO daoname empty handling
    const { data: daoList } = useQuery(GET_DAO_BY_NAME, {
      variables: { name: daoName },
    });
    
    const [daoDetails, updateDaoDetails] = useState<any>();
    const [config, setConfig] = useState<any | null>();
    
    useEffect(() => {
      if (daoList) {
        updateDaoDetails(daoList.daos[0]);
      }
    }, [daoList]);
    
    const proposalInstance = React.useMemo(() => {
      if(ethersProvider && account && daoDetails) {
        let queueApprovals = new QueueApprovals(ethersProvider.getSigner(), account, daoDetails.queue.address, daoDetails.config.resolver)
        const proposal =  new Proposal(daoDetails.queue.address, {} as ProposalOptions);
        return new FacadeProposal(queueApprovals, proposal) as (FacadeProposal & Proposal)
      }
    }, [ethersProvider, account, daoDetails])

    const transactionsQueue = React.useRef<CustomTransaction[]>([]);
    useEffect(() => {
      return function cleanUp() {
        transactionsQueue.current = [];
      };
    }, []);

    useEffect(() => {
      const _load = async () => {
        if (daoDetails) {
          console.log('called useeffect');
          const _config = daoDetails.queue.config;
          setConfig(_config);
          onChangeExecutionDelay(_config.executionDelay);
          onScheduleDepositContractAddress(_config.scheduleDeposit.token);
          onChangeScheduleDepositAmount(
            await correctDecimal(
              _config.scheduleDeposit.token,
              _config.scheduleDeposit.amount,
              false,
              ethersProvider
            ),
          );
          onChangeChallengeDepositContractAddress(
            _config.challengeDeposit.token,
          );
          onChangeChallengeDepositAmount(
            await correctDecimal(
              _config.challengeDeposit.token,
              _config.challengeDeposit.amount,
              false,
              ethersProvider
            ),
          );
          onChangeResolverAddress(_config.resolver);
          onChangeRules(toUtf8String(_config.rules));

        }
      };
      _load();
    }, [daoDetails, ethersProvider]);

    const [isOpen, setIsOpen] = useState(false);
    const [txList, setTxList] = useState<any[]>([]);
    const [isTrigger, setIsTrigger] = useState<boolean>(false);

    const closeModal = () => {
      setIsOpen(!isOpen);
    };

    const callSaveSetting = async () => {
      const newConfig: DaoConfig = {
        executionDelay: executionDelay,
        scheduleDeposit: {
          token: scheduleDepositContractAddress.current,
          amount: await correctDecimal(
            scheduleDepositContractAddress.current,
            scheduleDepositAmount.current,
            true,
            ethersProvider
          ),
        },
        challengeDeposit: {
          token: challengeDepositContractAddress.current,
          amount: await correctDecimal(
            challengeDepositContractAddress.current,
            challengeDepositAmount.current,
            true,
            ethersProvider
          ),
        },
        resolver: resolverAddress.current,
        rules: toUtf8Bytes(rules.current),
        maxCalldataSize: config.maxCalldataSize
      };

      const payload = buildPayload({
        submitter,
        executor: daoDetails.executor.address,
        actions: [
          proposalInstance?.buildAction('configure', [newConfig], 0)
        ],
        executionDelay: daoDetails.queue.config.executionDelay,
        proof: proof.current,
      });

      const container = {
        payload,
        config
      }

      console.log(container, 'container');
      
      if(proposalInstance) {
        try {
          transactionsQueue.current = await proposalInstance.schedule(container);
        }catch(error) {
          // TODO: Bhanu show error
          return
        }
      }

      dispatch({
        type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
        payload: {
          transactionList: transactionsQueue.current,
          onTransactionFailure: () => {},
          onTransactionSuccess: () => {},
          onCompleteAllTransactions: () => {}
        },
      });

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
              {'● ' + tx.txText}
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
                state={tx.status}
                caption={tx.txText}
              />
            </div>
          );
        })}
      </div>
    );

    const [diactivateModalButton, setDiactivateModalButton] = useState<boolean>(
      false,
    );
    const [txIndexToRun, setTxIndexToRun] = useState(0);

    useEffect(() => {
      txList.forEach((_, index) => {
        if (txList[index].status === CiruclarProgressStatus.InProgress) {
          setDiactivateModalButton(true);
          const txExcutor = async () => {
            let _txList = [...txList];
            const result = await txList[txIndexToRun].txAction();
            if (result) {
              _txList[txIndexToRun].status = CiruclarProgressStatus.Done;
              setTxIndexToRun(txIndexToRun + 1);
            } else {
              _txList[txIndexToRun].status = CiruclarProgressStatus.Failed;
            }
            setTxList(_txList);
            setDiactivateModalButton(false);
          };
          txExcutor();
        }
      });
    }, [txList]);

    const modalContainer = (
      <div>
        {isTrigger ? txTrigerContainer : txReviewContainer}
        {isTrigger ? (
          <ANButton
            disabled={diactivateModalButton}
            label={'Continue'}
            buttonType={'primary'}
            onClick={async () => {
              if (txIndexToRun >= txList.length) {
                closeModal();
                onClickBack();
              } else {
                let _txList = [...txList];
                _txList[txIndexToRun].status =
                  CiruclarProgressStatus.InProgress;
                setTxList(_txList);
              }
            }}
            style={{ marginTop: '34px' }}
            width={'100%'}
          />
        ) : (
          <ANButton
            label={'Get started'}
            buttonType={'primary'}
            onClick={() => {
              setIsTrigger(true);
            }}
            style={{ marginTop: '34px' }}
            width={'100%'}
          />
        )}
      </div>
    );

    return proposalInstance ? (
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
              height="100px"
              width="100%"
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
            <OptionTextStyle>{'Text'}</OptionTextStyle>
            <div style={{ marginLeft: '20px' }}>
              <BlueSwitch
                disabled={false}
                checked={isProofFile}
                onChange={() => {
                  setIsProofFile(!isProofFile);
                }}
                name="ruleCheck"
              />
            </div>
            <OptionTextStyle>{'File'}</OptionTextStyle>
          </div>
          <InputSubTitle>Enter the Proof for changes</InputSubTitle>
          {!isProofFile ? (
            // <RuleTextArea
            //   onChange={onChangeProof}
            //   value={Proof.current}
            // />
            <InputField
              label=""
              onInputChange={onChangeProof}
              value={proof.current}
              height="100px"
              width="100%"
              placeholder={'Proof...'}
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
              disabled={status !== 'connected'}
              buttonType={'primary'}
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
