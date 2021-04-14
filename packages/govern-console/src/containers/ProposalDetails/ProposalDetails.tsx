import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import backButtonIcon from 'images/back-btn.svg';
import { Label } from 'components/Labels/Label';
import { useHistory } from 'react-router-dom';
import { GET_PROPOSAL_LIST_QUERY } from './queries';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';

interface ProposalDetailsProps {
  onClickBack?: any;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ onClickBack }) => {
  const history: any = useHistory();
  const theme = useTheme();
  const proposal = history.location.state.proposalDetails;

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
    if (proposal.state === 'Scheduled') return 'yellow';
    if (proposal.state === 'Executed') return 'green';
    if (proposal.state === 'Challenged') return 'red';
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
    display: 'inline',
    color: '#7483B3',
  });
  const InfoValueDivInline = styled('div')({
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#20232C',
    display: 'inline',
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

  const ActionDiv = styled((props: any) => <div {...props} />)((props: any) => {
    return {
      background: '#FFFFFF',
      border: '2px solid #F5F7FF',
      boxSizing: 'border-box',
      boxShadow: '0px 8px 7px rgba(116, 131, 178, 0.2)',
      borderRadius: '12px',
      height: props.isExpanded ? 'auto' : '66px',
      width: '100%',
      overflow: 'hidden',
      '& div': {
        marginTop: 0,
      },
    };
  });

  const CollapsedDiv = styled('div')({
    height: '66px',
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
  });
  //* End of styled Components

  const [proposalInfo, updateProposalInfo] = React.useState<any>(null);
  const [isExpanded, updateIsExpanded] = React.useState<any>({});

  const {
    data: proposalDetailsData,
    loading: isLoadingProposalDetails,
    error: errorFetchingProposalDetails,
  } = useQuery(GET_PROPOSAL_LIST_QUERY, {
    variables: {
      id: proposal.id,
    },
  });

  useEffect(() => {
    debugger;
    if (proposalDetailsData) {
      updateProposalInfo(proposalDetailsData.container);
    }
  }, [proposalDetailsData]);

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
              <BackButton>
                <img src={backButtonIcon} />
              </BackButton>
              <ProposalStatus>
                <Label
                  labelColor={getLabelColor()}
                  labelText={proposal.state}
                />
              </ProposalStatus>
              <ProposalId>{proposal.id}</ProposalId>
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
                      {proposalInfo.payload.executor.id || 'No executor ID'}
                    </InfoValueDivInline>
                  </InfoWrapper>
                  <InfoWrapper>
                    <InfoKeyDiv>On Chain Actions:</InfoKeyDiv>
                    <InfoValueDivInline>Proof Text</InfoValueDivInline>
                  </InfoWrapper>
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
                    <ActionsWrapper>
                      {/* Show action accordians */}
                      {proposalInfo.payload.actions.map(
                        (action: any, index: number) => {
                          return (
                            <ActionDiv
                              key={index}
                              isexpanded={isExpanded[index] || false}
                            >
                              <CollapsedDiv>
                                <InfoWrapper>
                                  <InfoKeyDiv>to</InfoKeyDiv>
                                  <InfoValueDivInline>
                                    <a>{action.to}</a>
                                  </InfoValueDivInline>
                                </InfoWrapper>
                                {/* <Carat /> */}
                              </CollapsedDiv>
                              <ExpandedDiv>
                                <InfoWrapper>
                                  <InfoKeyDiv>value</InfoKeyDiv>
                                  <InfoValueDivInline>
                                    <a>{action.value}</a>
                                  </InfoValueDivInline>
                                </InfoWrapper>
                                <InfoWrapper>
                                  <InfoKeyDiv>data</InfoKeyDiv>
                                  <InfoValueDivBlock>
                                    <a>{action.data}</a>
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
                <WidgetWrapper id="widget_wrapper"></WidgetWrapper>
              </DetailsWrapper>
            </StyledPaper>
          ) : null}
        </>
      )}
    </>
  );
};

export default ProposalDetails;
