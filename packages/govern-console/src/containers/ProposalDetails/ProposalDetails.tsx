import React, { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import backButtonIcon from 'images/back-btn.svg';
import { Label } from 'components/Labels/Label';
import { InputField } from 'components/InputFields/InputField';
import { useHistory, useParams } from 'react-router-dom';
import { GET_PROPOSAL_DETAILS_QUERY } from './queries';
import { GET_DAO_BY_NAME } from '../DAO/queries';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ANButton } from 'components/Button/ANButton';
import { useWallet } from '../../EthersWallet';
import { erc20ApprovalTransaction } from 'utils/transactionHelper';
import { ethers } from 'ethers';
import { CourtABI } from 'utils/abis/court';
import { AddressZero } from '@ethersproject/constants'
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';
import { Proposal, ProposalOptions, ProposalParams } from '@aragon/govern';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';

// import { InputField } from 'component/InputField/InputField';
interface ProposalDetailsProps {
  onClickBack?: any;
}

//* styled Components

const StyledPaper = styled(Paper)({
  backgroundColor: '#ffffff',
  height: 'auto',
  minHeight: '1000px',
  padding: '40px 48px 58px 48px',
});
const BackButton = styled('div')({
  height: 25,
  width: 62,
  cursor: 'pointer',
  position: 'relative',
  marginBottom: '36px',
  '& img': {
    cursor: 'pointer',
  },
});
const ProposalStatus = styled('div')({
  height: '20px',
  width: '100%',
  display: 'block',
  boxSizing: 'border-box',
});
const ProposalId = styled('div')(({ theme }) => ({
  height: '44px',
  width: '100%',
  color: theme.custom.black,
  fontWeight: 600,
  fontSize: '32px',
  lineHeight: '44px',
  marginTop: '11px',
  textOverflow: 'ellipsis',
  boxSizing: 'border-box',
}));
const DateDisplay = styled('div')({
  height: '25px',
  width: '100%',
  color: '#7483B3',
  marginTop: '10px',
  fontStyle: 'normal',
  fontWeight: 'normal',
  boxSizing: 'border-box',
});
const getLabelColor = (proposalState: string) => {
  if (proposalState === 'Scheduled') return 'yellow';
  if (proposalState === 'Executed') return 'green';
  if (proposalState === 'Challenged') return 'red';
};
const DetailsWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '47px',
});
const ProposalDetailsWrapper = styled('div')({
  width: 'calc(100% - 443px)',
  boxSizing: 'border-box',
  borderRadius: '16px',
  minHeight: '900px',
  border: ' 2px solid #E2ECF5',
  padding: '32px 30px',
});
const WidgetWrapper = styled('div')({
  width: '427px',
});
const TitleText = styled(Typography)({
  fontWeight: 600,
  fontSize: '28px',
  lineHeight: '38px',
  height: '38px',
  width: '100%',
  boxSizing: 'border-box',
});
const InfoWrapper = styled('div')({
  // display: 'flex',
  // flexDirection: 'column',
  // justifyContent: 'space-between',
  marginTop: '9px',
  width: '100%',
  boxSizing: 'border-box',
});
const InfoKeyDiv = styled('div')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '18px',
  height: '25px',
  width: 'fit-content',
  display: 'inline-block',
  color: '#7483B3',
});
const InfoValueDivInline = styled('div')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  color: '#20232C',
  display: 'inline-block',
  width: 'fit-content',
  marginLeft: '9px',
  '& a': {
    width: '100%',
    color: '#0094FF',
    boxSizing: 'border-box',
  },
});
const InfoValueDivBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '75%',
  height: 'auto',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  color: '#20232C',
  fontSize: '18px',
  marginTop: '9px',
  paddingLeft: '25px',
  boxSizing: 'border-box',
  '& a': {
    display: 'block',
    width: '100%',
    color: '#0094FF',
    boxSizing: 'border-box',
  },
  '& div': {
    display: 'block',
    height: 'auto',
    width: '100%',
    color: '#20232C',
    boxSizing: 'border-box',
  },
  '& > *': {
    marginBottom: '9px',
  },
  '& :last-child': {
    marginBottom: '0 !important',
  },
  '& .full-width': {
    width: '100% !important',
  },
});
const ActionsWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'auto',
  '& > *': {
    marginBottom: '8px',
  },
  '& :last-child': {
    marginBottom: '0 !important',
  },
});

const ActionDiv = styled('div')({
  background: '#FFFFFF',
  transition: 'all 1s ease-out',
  border: '2px solid #F5F7FF',
  boxSizing: 'border-box',
  boxShadow: '0px 8px 7px rgba(116, 131, 178, 0.2)',
  borderRadius: '12px',
  width: '100%',
  overflow: 'hidden',
  cursor: 'pointer',
  '& > div': {
    minHeight: '62px !important',
    verticalAlign: 'middle',
    lineHeight: '62px',
  },
  '& div': {
    marginTop: 0,
  },
  '& .full-width': {
    width: '100%',
  },
});

const CollapsedDiv = styled('div')({
  height: '62px',
  display: 'block',
  width: '100%',
  paddingLeft: '23px',
  paddingRight: '28px',
  boxSizing: 'border-box',
  margin: 0,
});
const ExpandedDiv = styled('div')({
  height: 'auto',
  display: 'block',
  width: '100%',
  paddingLeft: '23px',
  paddingRight: '38px',
  boxSizing: 'border-box',
  margin: 0,
  '& #value-div': {
    height: '27px',
    lineHeight: '27px',
    minHeight: '27px !important',
  },
  '& #data-div': {
    lineHeight: '25px',
    minHeight: '27px !important',
    // fontSize: '18px',
    height: 'fit-content',
  },
  '& #data-div-block': {
    // overflowWrap: 'normal',
    overflowWrap: 'break-word',
  },
});

const Widget = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  minHeight: '118px',
  boxSizing: 'border-box',
  background: '#FFFFFF',
  border: '2px solid #ECF1F7',
  boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
  borderRadius: '8px',
  marginBottom: '23px',
  padding: '36px 27px',
  '& div': {
    display: 'block',
    margin: 'auto',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '9px',
  },
  '& button': {
    marginTop: '5px',
  },
});

//* End of styled Components

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ onClickBack }) => {
  // const selectedProposal: any = {};
  // const history = useHistory();
  const { daoName, id: proposalId } = useParams<any>();
  const { data: daoList } = useQuery(GET_DAO_BY_NAME, {
    variables: { name: daoName },
  });
  const context: any = useWallet();

  const { account, ethersProvider } = context;

  const { dispatch } = React.useContext(ModalsContext);

  let signer: any;

  if (ethersProvider) {
    signer = ethersProvider.getSigner();
  }
  useEffect(() => {
    if (ethersProvider) {
      signer = ethersProvider.getSigner();
    }
  }, [ethersProvider]);

  const [proposalInfo, updateProposalInfo] = React.useState<any>(null);
  const [isExpanded, updateIsExpanded] = React.useState<any>({});
  const [daoDetails, updateDaoDetails] = React.useState<any>();
  const [transactions, updateTransactions] = React.useState<CustomTransaction[]>([]);
  const transactionsQueue = React.useRef<CustomTransaction[]>([]);
  const challengeReason = React.useRef('');
  const vetoReason = React.useRef('');

  const [
    getProposalData,
    {
      loading: isLoadingProposalDetails,
      data: proposalDetailsData,
      error: errorFetchingProposalDetails,
    },
  ] = useLazyQuery(GET_PROPOSAL_DETAILS_QUERY);

  useEffect(() => {
    return function cleanUp() {
      transactionsQueue.current = [];
    };
  }, []);

  useEffect(() => {
    if (proposalDetailsData) {
      updateProposalInfo(proposalDetailsData.container);
    }
  }, [proposalDetailsData]);

  const toggleDiv = (index: number) => {
    const cloneObject = { ...isExpanded };
    if (cloneObject[index]) {
      cloneObject[index] = false;
    } else {
      cloneObject[index] = true;
    }
    updateIsExpanded(cloneObject);
  };
  useEffect(() => {
    if (daoList) {
      updateDaoDetails(daoList.daos[0]);
      getProposalData({
        variables: {
          id: proposalId,
        },
      });
    }
  }, [daoList]);

  const proposalInstance = React.useMemo(() => {
    if (daoDetails) {
      const proposalOptions: ProposalOptions = {
        // provider: ethersProvider,
      };
      const proposal = new Proposal(daoDetails.queue.address, proposalOptions);
      return proposal;
    }
  }, [daoDetails]);

  const approveChallengeCollateralsIfNeeded = async () => {
    const contract = new ethers.Contract(
      proposalInfo.config.resolver,
      CourtABI,
      signer,
    );

    if (daoDetails.queue.config.scheduleDeposit.token !== AddressZero) {
      const challengeDepositApproval = await erc20ApprovalTransaction(
        daoDetails.queue.config.challengeDeposit.token,
        daoDetails.queue.config.challengeDeposit.amount,
        daoDetails.queue.address,
        account,
        ethersProvider,
      );
      console.log(challengeDepositApproval);
      if (challengeDepositApproval) {
        if (challengeDepositApproval.error) {
          console.log(challengeDepositApproval.error);
          return;
        }
        if (challengeDepositApproval.transactions.length > 0) {
          transactionsQueue.current.push(challengeDepositApproval.transactions[0]);
        }
      }
    }

    const [, feeToken, feeAmount] = await contract.getDisputeFees();
    
    if (feeToken !== AddressZero) {
      const feeTokenApproval = await erc20ApprovalTransaction(
        feeToken,
        feeAmount,
        daoDetails.queue.address,
        account,
        ethersProvider,
      );
      if (feeTokenApproval) {
        if (feeTokenApproval.error) {
          console.log(feeTokenApproval.error);
          return;
        }
        if (feeTokenApproval.transactions.length > 0) {
          transactionsQueue.current.push(feeTokenApproval.transactions[0]);
        }
      }
    }
  };

  const getProposalParams = () => {
    const payload = { ...proposalInfo.payload };
    const config = { ...proposalInfo.config };
    config.executionDelay = parseInt(config.executionDelay);
    payload.executor = payload.executor.address;
    const params: ProposalParams = {
      payload,
      config,
    };
    return params;
  };

  const onTransactionFailure = (
    errorMessage: string,
    transaction: CustomTransaction,
  ) => {
    console.log('hi');
  };
  const onTransactionSuccess = (
    transaction: CustomTransaction,
    transactionReceipt: any,
  ) => {
    console.log('hi');
  };
  const onCompleteAllTransactions = (transactions: CustomTransaction[]) => {
    console.log('hi');
  };

  const challengeProposal = async () => {
    const proposalParams = getProposalParams();
    await approveChallengeCollateralsIfNeeded();
    if (proposalInstance) {
      const challengeTransaction: CustomTransaction = {
        tx: () => {
          return proposalInstance.challenge(
            proposalParams,
            challengeReason.current,
          );
        },
        preTransactionMessage: 'Challenge Proposal',
        transactionMessage: 'Challenging Proposal',
        errorMessage: 'Error while Challenging Propsal',
        successMessage: 'Successfully Challenged Proposal',
        status: CustomTransactionStatus.Pending,
      };
      transactionsQueue.current.push(challengeTransaction);
      updateTransactions([...transactionsQueue.current]);
    }
    if (transactionsQueue.current.length > 0) {
      console.log(dispatch);
      // setIsTransactionModalOpen(true);
      dispatch({
        type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
        payload: {
          transactionList: transactionsQueue.current,
          onTransactionFailure,
          onTransactionSuccess,
          onCompleteAllTransactions,
        },
      });
    }
  };

  const executeProposal = async () => {
    const proposalParams = getProposalParams();
    console.log(proposalParams);
    console.log(proposalParams);
    // approveCollateralIfNeeded();
    if (proposalInstance) {
      const executeTransaction = await proposalInstance.execute(proposalParams);
      console.log(executeTransaction);
    }
  };

  // const resolveProposal = async () => {};

  const proposalStates: any = {};
  // check if the user has the veto power.
  if (proposalInfo) {
    proposalInfo.history.forEach((item: any) => {
      proposalStates[item.__typename] = item;
    });

    // =============================================
    // if(proposalStates['ContainerEventChallenge']){ MEANS it was challenged.
    //     show the followings
    //
    //     proposalStates['ContainerEventChallenge'].reason
    //     proposalStates['ContainerEventChallenge'].createdAt
    //     proposalStates['ContainerEventChallenge].challenger
    //

    // } else if(proposalInfo.state == 'Scheduled') {{
    //     show what you were showing before. (challenge reason label + input + button)
    //  }
    // =============================================

    // if(proposalStates['ContainerEventExecute']){
    //   show the following
    //   proposalStates['ContainerEventExecute'].createdAt
    //   proposalStates['ContainerEventExecute'].execResults bytes array here.. each member can have arbitrary size.
    // }else if(proposalInfo.state == 'Scheduled'){
    //   if({proposalInfo.payload.executionTime - currentTimestamp} > 0) - show the message: You will not be able to execute this action until {proposalInfo.payload.executionTime - proposalInfo.payload.currentTimestamp} in human readable date format
    //   else show what you were showing before. (execute button)
    // }
    // =============================================
    // if(proposalStates['ContainerEventVeto']){
    //     show the following
    //     proposalStates['ContainerEventVeto'].createdAt
    //     proposalStates['ContainerEventVeto'].reason // This is the array of bytes, where each member can be any size.
    //  }
    //  else if(proposalInfo.state == 'Scheduled' || proposalInfo.state == 'Challenged')){
    //    const vetoRoles = proposalInfo.queue.roles.filter(
    //       (role: any) => role.selector === proposalInstance.getSigHash('veto') &&
    //       role.who == "0x94C34FB5025e054B24398220CBDaBE901bd8eE5e" && // TODO: Bhanu instead of address, put signer's address
    //       role.granted
    //    )
    //    if(vetoRoles.length === 0){
    //        TODO:Bhanu If This comes here, it means user doens't have the veto permission, which means we should be showing
    //        the message on the veto card: You don't have the permission to veto the proposal. Otherwise
    //    }else{
    //        // show veto reason label + input + veto button as showing previously.
    //    }

    //  }

    // =============================================
    // if(proposalStates['ContainerEventResolve']){
    //   show the following
    //   proposalStates['ContainerEventResolve'].createdAt
    //   proposalStates['ContainerEventResolve'].approved  true or false. (yes | no)
    // } else if(proposalInfo.state == 'Challenged'){
    //     show the new card where only button is resolve.
    //
    // }

    console.log(proposalInfo, ' proposal info');
  }

  // const getParsedDataFromBytes = (data) => {

  // };

  return (
    <>
      {isLoadingProposalDetails ? (
        <> Loading...</>
      ) : (
        <>
          {proposalInfo ? (
            <StyledPaper elevation={0}>
              <BackButton onClick={onClickBack}>
                <img src={backButtonIcon} />
              </BackButton>
              <ProposalStatus>
                <Label
                  labelColor={getLabelColor(proposalInfo.status)}
                  labelText={proposalInfo.state}
                />
              </ProposalStatus>
              <ProposalId>{proposalInfo.id}</ProposalId>
              <DateDisplay>
                {
                  // TODO:Bhanu you can make this work with the dates library you use
                  new Date(proposalInfo.createdAt * 1000).toLocaleDateString(
                    'en-US',
                  ) +
                    ' ' +
                    new Date(proposalInfo.createdAt * 1000).toLocaleTimeString(
                      'en-US',
                    )
                }
              </DateDisplay>
              <DetailsWrapper>
                <ProposalDetailsWrapper id="proposal_wrapper">
                  <TitleText>Config</TitleText>
                  <InfoWrapper>
                    <InfoKeyDiv>Execution Delay:</InfoKeyDiv>
                    <InfoValueDivInline>
                      {proposalInfo.config.executionDelay}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Schedule Deposit:</InfoKeyDiv>
                    <InfoValueDivBlock>
                      <a>{proposalInfo.config.scheduleDeposit.token}</a>
                      <div>
                        {proposalInfo.config.scheduleDeposit.amount} ANT
                      </div>
                    </InfoValueDivBlock>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Challenge Deposit:</InfoKeyDiv>
                    <InfoValueDivBlock>
                      <a>{proposalInfo.config.challengeDeposit.token}</a>
                      <div>
                        {proposalInfo.config.challengeDeposit.amount} ANT
                      </div>
                    </InfoValueDivBlock>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Resolver:</InfoKeyDiv>
                    <InfoValueDivInline>
                      <a>{proposalInfo.config.resolver}</a>
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Rules:</InfoKeyDiv>
                    {/* <InfoValueDivInline>{getParsedDataFromBytes(proposalInfo.config.rules)}</InfoValueDivInline> */}
                    <InfoValueDivInline>
                      {proposalInfo.config.rules}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <div style={{ height: '32px', width: '100%' }} />

                  <TitleText>Payload</TitleText>
                  <InfoWrapper>
                    <InfoKeyDiv>Nonce:</InfoKeyDiv>
                    <InfoValueDivInline>
                      {proposalInfo.payload.nonce}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Execution Time:</InfoKeyDiv>
                    <InfoValueDivInline>
                      {proposalInfo.payload.executionTime}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Submitter:</InfoKeyDiv>
                    <InfoValueDivInline>
                      {proposalInfo.payload.submitter}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Executor:</InfoKeyDiv>
                    <InfoValueDivInline>
                      {proposalInfo.payload.executor.address ||
                        'No executor ID'}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  {/* <InfoWrapper>
                    <InfoKeyDiv>On Chain Actions:</InfoKeyDiv>
                    <InfoValueDivInline>Proof Text</InfoValueDivInline>
                  </InfoWrapper> */}
                  <InfoWrapper>
                    <InfoKeyDiv>AllowFailuresMap:</InfoKeyDiv>
                    <InfoValueDivInline>
                      {proposalInfo.payload.allowFailuresMap}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Proof:</InfoKeyDiv>
                    <InfoValueDivBlock>
                      {proposalInfo.payload.proof}
                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. */}
                    </InfoValueDivBlock>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Actions:</InfoKeyDiv>
                    <ActionsWrapper id="action-wrapper">
                      {/* Show action accordians */}
                      {proposalInfo.payload.actions.map(
                        (action: any, index: number) => {
                          return (
                            <ActionDiv
                              key={index}
                              onClick={() => toggleDiv(index)}
                              id={'action' + index}
                              style={{
                                height: isExpanded[index]
                                  ? 'fit-content !important'
                                  : '66px',
                              }}
                            >
                              <CollapsedDiv id="collapsed-div">
                                <InfoWrapper id="to-div">
                                  <InfoKeyDiv>to</InfoKeyDiv>
                                  <InfoValueDivInline>
                                    <a>{action.to}</a>
                                  </InfoValueDivInline>
                                </InfoWrapper>
                                {/* <Carat /> */}
                              </CollapsedDiv>
                              <ExpandedDiv id="expanded-div">
                                <InfoWrapper id="value-div">
                                  <InfoKeyDiv>value</InfoKeyDiv>
                                  <InfoValueDivInline>
                                    <a>{action.value}</a>
                                  </InfoValueDivInline>
                                </InfoWrapper>
                                <InfoWrapper id="data-div">
                                  <InfoKeyDiv>data</InfoKeyDiv>
                                  <InfoValueDivBlock
                                    className="full-width"
                                    id="data-div-block"
                                  >
                                    {action.data}
                                  </InfoValueDivBlock>
                                </InfoWrapper>
                              </ExpandedDiv>
                            </ActionDiv>
                          );
                        },
                      )}
                    </ActionsWrapper>
                  </InfoWrapper>
                </ProposalDetailsWrapper>
                <WidgetWrapper id="widget_wrapper">
                  <Widget>
                    <div
                      style={{
                        fontFamily: 'Manrope',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '18px',
                        color: '#7483B3',
                      }}
                    >
                      Challenge Reason
                    </div>
                    <InputField
                      onInputChange={(value) => {
                        challengeReason.current = value;
                      }}
                      label={''}
                      placeholder={''}
                      height={'46px'}
                      width={'372px'}
                      // value={challengeReason.current}
                    />
                    <ANButton
                      buttonType="primary"
                      label="Challenge"
                      height="45px"
                      width="372px"
                      style={{ margin: 'auto' }}
                      onClick={() => challengeProposal()}
                    />
                  </Widget>
                  {/* <Widget>
                    <div
                      style={{
                        fontFamily: 'Manrope',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '18px',
                        color: '#7483B3',
                      }}
                    >
                      Veto Reason
                    </div>
                    <InputField
                      onInputChange={(value) => {
                        vetoReason.current = value;
                      }}
                      label={''}
                      placeholder={''}
                      height={'46px'}
                      width={'372px'}
                      // value={vetoReason.current}
                    />
                    <ANButton
                      label="Veto"
                      height="45px"
                      width="372px"
                      style={{ margin: 'auto' }}
                      //  onClick={}
                    />
                  </Widget> */}
                  <Widget>
                    <ANButton
                      label="Execute"
                      height="45px"
                      width="372px"
                      style={{ margin: 'auto' }}
                      onClick={executeProposal}
                      buttonType="primary"
                    />
                  </Widget>
                  <Widget>
                    <ANButton
                      buttonType="primary"
                      label="Resolve"
                      height="45px"
                      width="372px"
                      style={{ margin: 'auto' }}
                      // onClick={resolveProposal(disputeId)}
                    />
                  </Widget>
                </WidgetWrapper>
              </DetailsWrapper>
            </StyledPaper>
          ) : null}
        </>
      )}
    </>
  );
};

export default ProposalDetails;
