import React, { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import backButtonIcon from 'images/back-btn.svg';
import { Label } from 'components/Labels/Label';
import { useParams } from 'react-router-dom';
import { GET_PROPOSAL_DETAILS_QUERY } from './queries';
import { GET_DAO_BY_NAME } from '../DAO/queries';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useWallet } from '../../AugmentedWallet';
import { CustomTransaction } from 'utils/types';
import { getProposalParams } from 'utils/ERC3000';
import { Proposal, ProposalOptions } from '@aragon/govern';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import QueueApprovals from 'services/QueueApprovals';
import FacadeProposal from 'services/Proposal';
import AbiHandler from 'utils/AbiHandler';
import { toUtf8String } from '@ethersproject/strings';
import { formatDate } from 'utils/date';
import { getState, getStateColor } from 'utils/states';
import { useSnackbar } from 'notistack';

// widget components
import ChallengeWidget from './components/ChallengeWidget';
import ExecuteWidget from './components/ExecuteWidget';
import ResolveWidget from './components/ResolveWidget';
interface ProposalDetailsProps {
  onClickBack?: any;
}

//* styled Components

const StyledPaper = styled(Paper)({
  backgroundColor: '#ffffff',
  height: 'auto',
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
  fontFamily: 'Manrope',
}));
const DateDisplay = styled('div')({
  height: '25px',
  fontFamily: 'Manrope',
  width: '100%',
  color: '#7483B3',
  marginTop: '10px',
  fontStyle: 'normal',
  fontWeight: 'normal',
  boxSizing: 'border-box',
});
const DetailsWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '47px',
  fontFamily: 'Manrope',
});
const ProposalDetailsWrapper = styled('div')({
  width: 'calc(100% - 443px)',
  boxSizing: 'border-box',
  borderRadius: '16px',
  minHeight: '900px',
  border: ' 2px solid #E2ECF5',
  padding: '32px 30px',
  fontFamily: 'Manrope',
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
  fontFamily: 'Manrope',
});
export const InfoWrapper = styled('div')({
  // display: 'flex',
  // flexDirection: 'column',
  // justifyContent: 'space-between',
  marginTop: '9px',
  width: '100%',
  boxSizing: 'border-box',
  height: 'fit-content',
  fontFamily: 'Manrope',
});
export const InfoKeyDiv = styled('div')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '18px',
  minHeight: '25px',
  height: 'fit-content',
  width: 'fit-content',
  display: 'inline-block',
  color: '#7483B3',
});
export const InfoValueDivInline = styled('div')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  color: '#20232C',
  display: 'inline-block',
  width: 'fit-content',
  marginLeft: '9px',
  maxWidth: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  minHeight: '25px',
  lineHeight: '25px',
  fontSize: '18px',
  '& a': {
    width: '100%',
    color: '#0094FF',
    boxSizing: 'border-box',
    height: '25px',
    display: 'block',
    lineHeight: '25px',
  },
});
const InfoValuePre = styled('pre')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  color: '#20232C',
  overflow: 'auto',
  margin: '0',
});

export const InfoValueDivBlock = styled('div')(({ maxlines }: { maxlines?: number }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '75%',
  height: 'auto',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  color: '#20232C',
  fontSize: '18px',
  marginTop: '9px',
  paddingLeft: '25px',
  boxSizing: 'border-box',
  maxWidth: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  WebkitLineClamp: maxlines || 'none',
  boxOrientation: 'vertical',
  // wordBreak:'break-all',
  '& a': {
    display: 'block',
    width: 'fit-content',
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
}));
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
    display: 'flex',
    minHeight: '62px !important',
    alignItems: 'center',
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,

    // lineHeight: '62px',
  },
  '& div': {
    marginTop: 0,
  },
  '& .full-width': {
    width: '100%',
  },
});

const CollapsedDiv = styled('div')({
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
    height: '30px',
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

//* End of styled Components

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ onClickBack }) => {
  const { daoName, id: proposalId } = useParams<any>();
  const { data: daoList } = useQuery(GET_DAO_BY_NAME, {
    variables: { name: daoName },
  });
  const context: any = useWallet();

  const { account, provider, networkName, isConnected } = context;

  const { dispatch } = React.useContext(ModalsContext);
  const { enqueueSnackbar } = useSnackbar();

  const [proposalInfo, updateProposalInfo] = React.useState<any>(null);
  const [abiCache, updateAbiCache] = React.useState<any>({});
  const [decodedData, updateDecodedData] = React.useState<any>({});
  const [decoding, setDecoding] = React.useState(false);
  const [isExpanded, updateIsExpanded] = React.useState<any>({});
  const [daoDetails, updateDaoDetails] = React.useState<any>();
  const [challengeReason, setChallengeReason] = React.useState('');
  const transactionsQueue = React.useRef<CustomTransaction[]>([]);

  const abiHandler = React.useMemo(() => {
    if (networkName) {
      return new AbiHandler(networkName);
    }
  }, [networkName]);

  const proposalInstance = React.useMemo(() => {
    if (provider && account && daoDetails && proposalInfo) {
      const queueApprovals = new QueueApprovals(
        account,
        daoDetails.queue.address,
        proposalInfo.config.resolver,
      );
      const proposal = new Proposal(daoDetails.queue.address, {} as ProposalOptions);
      return new FacadeProposal(queueApprovals, proposal) as FacadeProposal & Proposal;
    }
  }, [provider, account, daoDetails, proposalInfo]);

  const [
    getProposalData,
    { loading: isLoadingProposalDetails, data: proposalDetailsData },
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

  const toggleDiv = async (index: number) => {
    const cloneObject = { ...isExpanded };
    if (cloneObject[index]) {
      cloneObject[index] = false;
    } else {
      cloneObject[index] = true;
    }
    updateIsExpanded(cloneObject);

    // try to decode action data if the div was expanded for the first time
    if (cloneObject[index] && !decodedData[index] && abiHandler) {
      setDecoding(true);
      const action = proposalInfo.payload.actions[index];
      let abi = abiCache[index];
      if (abi === undefined) {
        abi = await abiHandler.get(action.to);
        updateAbiCache({ ...abiCache, [action.to]: abi });
      }

      if (abi) {
        const data = AbiHandler.decode(abi, action.data);
        if (data) {
          updateDecodedData({ ...decodedData, [index]: data });
        }
      }
      setDecoding(false);
    }
  };

  useEffect(() => {
    if (daoList && proposalId && getProposalData) {
      updateDaoDetails(daoList.daos[0]);
      getProposalData({
        variables: {
          id: proposalId,
        },
      });
    }
  }, [daoList, proposalId, getProposalData]);

  const challengeProposal = async () => {
    // if the reason's length is less than 10 words, it's highly unlikely
    // to specify the actual valid reason in less than 10 words
    if (challengeReason.length < 10) {
      enqueueSnackbar('Challenge reason must be at least 10 letters', { variant: 'error' });
      return;
    }

    const proposalParams = getProposalParams(proposalInfo);

    if (proposalInstance) {
      try {
        transactionsQueue.current = await proposalInstance.challenge(
          proposalParams,
          challengeReason,
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }

    // setIsTransactionModalOpen(true);
    dispatch({
      type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
      payload: {
        transactionList: transactionsQueue.current,
        onTransactionFailure: (error) => {
          enqueueSnackbar(error, { variant: 'error' });
        },
        onTransactionSuccess: () => {
          //
        },
        onCompleteAllTransactions: () => {
          //
        },
      },
    });
  };

  const executeProposal = async () => {
    const proposalParams = getProposalParams(proposalInfo);
    if (proposalInstance) {
      try {
        await proposalInstance.execute(proposalParams);
      } catch (error) {
        enqueueSnackbar(error.error.message, { variant: 'error' });
      }
    }
  };

  const resolveProposal = async (disputeId: number) => {
    const proposalParams = getProposalParams(proposalInfo);
    if (proposalInstance) {
      try {
        await proposalInstance.resolve(proposalParams, disputeId);
      } catch (error) {
        enqueueSnackbar(error.error.message, { variant: 'error' });
      }
    }
  };

  const proposalStates: any = {};
  if (proposalInfo) {
    proposalInfo.history.forEach((item: any) => {
      proposalStates[item.__typename] = item;
    });
  }

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
                  labelColor={getStateColor(proposalInfo.state, proposalInfo.payload.executionTime)}
                  labelText={getState(proposalInfo.state, proposalInfo.payload.executionTime)}
                />
              </ProposalStatus>
              <ProposalId>{proposalInfo.id}</ProposalId>
              <DateDisplay>{formatDate(proposalInfo.createdAt)}</DateDisplay>
              <DetailsWrapper>
                <ProposalDetailsWrapper id="proposal_wrapper">
                  <TitleText>Config</TitleText>
                  <InfoWrapper>
                    <InfoKeyDiv>Execution Delay:</InfoKeyDiv>
                    <InfoValueDivInline>{proposalInfo.config.executionDelay}</InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Schedule Deposit:</InfoKeyDiv>
                    <InfoValueDivBlock>
                      <a>{proposalInfo.config.scheduleDeposit.token}</a>
                      <div>{proposalInfo.config.scheduleDeposit.amount} ANT</div>
                    </InfoValueDivBlock>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Challenge Deposit:</InfoKeyDiv>
                    <InfoValueDivBlock>
                      <a>{proposalInfo.config.challengeDeposit.token}</a>
                      <div>{proposalInfo.config.challengeDeposit.amount} ANT</div>
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
                      {toUtf8String(proposalInfo.config.rules)}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <div style={{ height: '32px', width: '100%' }} />

                  <TitleText>Payload</TitleText>
                  <InfoWrapper>
                    <InfoKeyDiv>Nonce:</InfoKeyDiv>
                    <InfoValueDivInline>{proposalInfo.payload.nonce}</InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Execution Time:</InfoKeyDiv>
                    <InfoValueDivInline>{proposalInfo.payload.executionTime}</InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Submitter:</InfoKeyDiv>
                    <InfoValueDivInline>{proposalInfo.payload.submitter}</InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Executor:</InfoKeyDiv>
                    <InfoValueDivInline>
                      {proposalInfo.payload.executor.address || 'No executor ID'}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>AllowFailuresMap:</InfoKeyDiv>
                    <InfoValueDivInline>{proposalInfo.payload.allowFailuresMap}</InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Proof:</InfoKeyDiv>
                    <InfoValueDivBlock>
                      {toUtf8String(proposalInfo.payload.proof)}
                    </InfoValueDivBlock>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>Actions:</InfoKeyDiv>
                    <ActionsWrapper id="action-wrapper">
                      {/* Show action accordians */}
                      {proposalInfo.payload.actions.map((action: any, index: number) => {
                        return (
                          <ActionDiv
                            key={index}
                            onClick={() => toggleDiv(index)}
                            id={'action' + index}
                            style={{
                              height: 'auto',
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
                            {isExpanded[index] && (
                              <ExpandedDiv id="expanded-div">
                                <InfoWrapper id="value-div">
                                  <InfoKeyDiv>value</InfoKeyDiv>
                                  <InfoValueDivInline>
                                    <a>{action.value}</a>
                                  </InfoValueDivInline>
                                </InfoWrapper>
                                {decoding && <div>Decoding data....</div>}
                                {!decoding && !decodedData[index] && (
                                  <InfoWrapper id="data-div">
                                    <InfoKeyDiv>data</InfoKeyDiv>
                                    <InfoValueDivBlock className="full-width" id="data-div-block">
                                      {action.data}
                                    </InfoValueDivBlock>
                                  </InfoWrapper>
                                )}
                                {!decoding && decodedData[index] && (
                                  <React.Fragment>
                                    <InfoWrapper id="function-div">
                                      <InfoKeyDiv>function</InfoKeyDiv>
                                      <InfoValueDivInline>
                                        <a>{decodedData[index].functionName}</a>
                                      </InfoValueDivInline>
                                    </InfoWrapper>
                                    <InfoWrapper id="data-div">
                                      <InfoKeyDiv>arguments</InfoKeyDiv>
                                      {decodedData[index] && (
                                        <InfoValuePre>
                                          {JSON.stringify(decodedData[index].inputData, null, 2)}
                                        </InfoValuePre>
                                      )}
                                    </InfoWrapper>
                                  </React.Fragment>
                                )}
                              </ExpandedDiv>
                            )}
                          </ActionDiv>
                        );
                      })}
                    </ActionsWrapper>
                  </InfoWrapper>
                </ProposalDetailsWrapper>
                <WidgetWrapper id="widget_wrapper">
                  {
                    <ChallengeWidget
                      disabled={!isConnected}
                      containerEventChallenge={proposalStates['ContainerEventChallenge']}
                      currentState={proposalInfo.state}
                      setChallengeReason={setChallengeReason}
                      onChallengeProposal={challengeProposal}
                    />
                  }

                  {
                    <ExecuteWidget
                      disabled={!isConnected}
                      containerEventExecute={proposalStates['ContainerEventExecute']}
                      currentState={proposalInfo.state}
                      executionTime={proposalInfo.payload.executionTime}
                      onExecuteProposal={executeProposal}
                    />
                  }
                  {
                    <ResolveWidget
                      disabled={!isConnected}
                      containerEventExecute={proposalStates['ContainerEventResolve']}
                      disputeId={
                        proposalStates['ContainerEventChallenge']
                          ? proposalStates['ContainerEventChallenge'].disputeId
                          : null
                      }
                      currentState={proposalInfo.state}
                      executionTime={proposalInfo.payload.executionTime}
                      onResolveProposal={resolveProposal}
                    />
                  }
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
