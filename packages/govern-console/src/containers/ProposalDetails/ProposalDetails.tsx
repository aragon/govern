/* eslint-disable */
import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import backButtonIcon from 'images/back-btn.svg';
import { Label } from 'components/Labels/Label';
import { InputField } from 'components/InputFields/InputField';
import { useHistory } from 'react-router-dom';
import { GET_PROPOSAL_DETAILS_QUERY } from './queries';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { useWallet } from '../../EthersWallet';
import { erc20ApprovalTransaction } from 'utils/transactionHelper';
import { ethers } from 'ethers';
import { CourtABI } from 'utils/abis/court';

import {
  Proposal,
  ProposalOptions,
  ProposalParams,
  PayloadType,
  DaoConfig,
} from '@aragon/govern';

// import { InputField } from 'component/InputField/InputField';
interface ProposalDetailsProps {
  onClickBack?: any;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ onClickBack }) => {
  let selectedProposal: any = {};
  const history = useHistory();
  const selectedProposalString = sessionStorage.getItem('selectedProposal');
  if (selectedProposalString) {
    selectedProposal = JSON.parse(selectedProposalString);
  } else {
    history.push('/');
  }
  let daoDetails: any = null;
  const daoDetailsString = sessionStorage.getItem('selectedDao');
  if (daoDetailsString) {
    daoDetails = JSON.parse(daoDetailsString);
  }
  if (!daoDetails) {
    history.push('/');
  }
  const theme = useTheme();
  const context: any = useWallet();
  const {
    connector,
    account,
    balance,
    chainId,
    connect,
    connectors,
    ethereum,
    error,
    getBlockNumber,
    networkName,
    reset,
    status,
    type,
    ethersProvider,
  } = context;

  let signer: any;

  if (ethersProvider) {
    signer = ethersProvider.getSigner();
  }
  useEffect(() => {
    if (ethersProvider) {
      signer = ethersProvider.getSigner();
    }
  }, [ethersProvider]);

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
  const ProposalId = styled('div')({
    height: '44px',
    width: '100%',
    color: theme.custom.black,
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: '44px',
    marginTop: '11px',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
  });
  const DateDisplay = styled('div')({
    height: '25px',
    width: '100%',
    color: '#7483B3',
    marginTop: '10px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    boxSizing: 'border-box',
  });
  const getLabelColor = () => {
    if (selectedProposal.state === 'Scheduled') return 'yellow';
    if (selectedProposal.state === 'Executed') return 'green';
    if (selectedProposal.state === 'Challenged') return 'red';
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

  const [proposalInfo, updateProposalInfo] = React.useState<any>(null);
  const [isExpanded, updateIsExpanded] = React.useState<any>({});
  const challengeReason = React.useRef('');
  const vetoReason = React.useRef('');

  type ProposalType = {
    state: string;
    config: DaoConfig;
    payload: PayloadType;
    id: string;
  };

  const {
    data: proposalDetailsData,
    loading: isLoadingProposalDetails,
    error: errorFetchingProposalDetails,
  } = useQuery(GET_PROPOSAL_DETAILS_QUERY, {
    variables: {
      id: selectedProposal.id,
    },
  });

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

  const proposalInstance = React.useMemo(() => {
    const proposalOptions: ProposalOptions = {
      // provider: ethersProvider,
    };
    const proposal = new Proposal(daoDetails.queue.address, proposalOptions);
    return proposal;
  }, [daoDetails]);

  const approveChallengeCollateralsIfNeeded = async () => {
    const contract = new ethers.Contract(
      proposalInfo.config.resolver,
      CourtABI,
      signer,
    );

    // TODO:GIORGI error tracking make it better
    if(daoDetails.queue.config.scheduleDeposit.token !== '0x'+'0'.repeat(20)){
      const challengeDepositApproval = await erc20ApprovalTransaction(
        daoDetails.queue.config.challengeDeposit.token,
        daoDetails.queue.config.challengeDeposit.amount,
        daoDetails.queue.address,
        ethersProvider,
        account,
      );

      if(challengeDepositApproval.error) {
        console.log(challengeDepositApproval.error, ' approval error')
        // TODO:GIORGI don't continue
      }
  
      if(challengeDepositApproval.transactions.length > 0) {
        try {
          const transactionResponse: any = await challengeDepositApproval.transactions[0].tx();
          await transactionResponse.wait();
        } catch (err) {
          console.log(err);
        }
      }
    }


    const [, feeToken, feeAmount] = await contract.getDisputeFees();

    if(feeToken !== '0x'+'0'.repeat(20)){
      const feeTokenApproval = await erc20ApprovalTransaction(
        feeToken,
        feeAmount,
        daoDetails.queue.address,
        ethersProvider,
        account,
      );
      if(feeTokenApproval.error) {
        console.log(feeTokenApproval.error, ' approval error')
        // TODO:GIORGI don't continue if this fails.
      }
  
      if(feeTokenApproval.transactions.length > 0) {
        try {
          const transactionResponse: any = await feeTokenApproval.transactions[0].tx();
          await transactionResponse.wait();
        } catch (err) {
          console.log(err);
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

  const challengeProposal = async () => {
    const proposalParams = getProposalParams();
    console.log(proposalParams);
    await approveChallengeCollateralsIfNeeded();
    const challengeTransaction = await proposalInstance.challenge(
      proposalParams,
      challengeReason.current,
    );
    console.log(challengeTransaction);
  };

  const executeProposal = async () => {
    const proposalParams = getProposalParams();
    console.log(proposalParams);
    console.log(proposalParams);
    // approveCollateralIfNeeded();
    const executeTransaction = await proposalInstance.execute(proposalParams);
    console.log(executeTransaction);
  };

  // const getParsedDataFromBytes = (data) => {
  console.log(proposalInfo, ' great');
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
                  labelColor={getLabelColor()}
                  labelText={selectedProposal.state}
                />
              </ProposalStatus>
              <ProposalId>{selectedProposal.id}</ProposalId>
              <DateDisplay>3/29/2021</DateDisplay>
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
                        {proposalInfo.config.scheduleDeposit.amount} ANT
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
                      label="Challenge"
                      height="45px"
                      width="372px"
                      style={{ margin: 'auto' }}
                      onClick={() => challengeProposal()}
                    />
                  </Widget>
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
                      Veto Reason
                    </div>
                    <div>{/* <ANInput /> */}</div>
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
                      label="Execute"
                      height="45px"
                      width="372px"
                      style={{ margin: 'auto' }}
                      //  onClick={}
                    />
                  </Widget>
                  <Widget>
                    <ANButton
                      label="Execute"
                      height="45px"
                      width="372px"
                      style={{ margin: 'auto' }}
                      onClick={executeProposal}
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
