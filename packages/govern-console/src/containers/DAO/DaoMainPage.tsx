import React, { useRef, useState, useEffect } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import { DaoHeader } from '../../components/DaoHeader/DaoHeader';
import { ProposalCard } from '../../components/ProposalCards/ProposalCard';
import { ANButton } from '../../components/Button/ANButton';
import { InputField } from '../../components/InputFields/InputField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { GET_PROPOSAL_LIST } from './queries';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { formatEther } from 'ethers/lib/utils';

export const DaoMainPage: React.FC<{ onClickProposalCard: any }> = ({
  onClickProposalCard,
  ...props
}) => {
  const theme = useTheme();
  const [isProposalPage, setProposalPage] = useState(true);
  const [visibleProposalList, updateVisibleProposalList] = useState<any>([]);
  const [isProfilePage, setProfilePage] = useState(false);
  const searchString = useRef('');
  const history: any = useHistory();
  const daoDetails = history.location.state.daoDetails;

  // useEffect(() => {
  //   if (isProfile) {
  //     setProposalPage(false);
  //     setProfilePage(true);
  //   }
  // }, [isProfile]);

  const onInputChange = (val: string) => {
    searchString.current = val;
  };
  const onSearch = () => {
    console.log(searchString.current);
  };
  const onPageChange = (page: string) => {
    if (page === 'profile') {
      setProposalPage(false);
      setProfilePage(true);
    } else {
      setProposalPage(true);
      setProfilePage(false);
    }
  };

  const {
    data: queueData,
    loading: isLoadingProposals,
    error: errorLoadingProposals,
    fetchMore: fetchMoreProposals,
  } = useQuery(GET_PROPOSAL_LIST, {
    variables: {
      id: daoDetails.queue.id,
    },
  });

  useEffect(() => {
    if (queueData) {
      updateVisibleProposalList(queueData.governQueue.containers);
    }
  }, [queueData]);

  //* Styled Components List
  const DaoPageMainDiv = styled(Paper)({
    width: '100%',
    background: theme.custom.white,
    height: 'auto',
    padding: '0px',
    boxShadow: 'none',
  });

  const PageLabelSelected = styled(Typography)({
    background:
      'linear-gradient(282.07deg, #01E8F7 -5.08%, #01DCFA 21.97%, #00C2FF 81.4%)',
    lineHeight: '25px',
    fontSize: '20px',
    fontWeight: 500,
    fontFamily: theme.custom.daoCard.fontFamily,
    fontStyle: theme.custom.daoCard.fontStyle,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
  });

  const PageLabel = styled(Typography)({
    color: '#7483AB',
    lineHeight: '25px',
    fontSize: '20px',
    fontWeight: 500,
    fontFamily: theme.custom.daoCard.fontFamily,
    fontStyle: theme.custom.daoCard.fontStyle,
    cursor: 'pointer',
  });
  //* Styled Components List End

  return (
    <DaoPageMainDiv>
      <DaoHeader
        ethBalance={formatEther(daoDetails.executor.balance)}
        usdBalance={'2222'}
        daoName={daoDetails.name}
      />
      <div
        style={{
          paddingTop: '33px',
          paddingRight: '48px',
          paddingLeft: '48px',
          paddingBottom: '52px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '250px',
            justifyContent: 'space-between',
          }}
        >
          {isProposalPage ? (
            <PageLabelSelected>Proposals</PageLabelSelected>
          ) : (
            <PageLabel onClick={() => onPageChange('proposal')}>
              Proposal
            </PageLabel>
          )}
          {/* {isProfilePage ? (
            <PageLabelSelected>Profile</PageLabelSelected>
          ) : (
            <PageLabel onClick={() => onPageChange('profile')}>
              Profile
            </PageLabel>
          )} */}
        </div>
        {isProposalPage ? (
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginTop: '28px',
              }}
            >
              <InputField
                label=""
                placeholder="Search"
                width="298px"
                height="46px"
                onInputChange={onInputChange}
              ></InputField>
              <ANButton
                label="New Proposal"
                type="primary"
                height="46px"
                width="142px"
              ></ANButton>
            </div>
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                justifyContent: 'space-between',
              }}
            >
              {visibleProposalList.map((proposal: any) => (
                <div style={{ marginTop: '16px' }} key={proposal.id}>
                  <ProposalCard
                    transactionHash={proposal.id}
                    proposalDate={'3/29/2021'}
                    proposalStatus={proposal.state}
                    onClickProposalCard={() => onClickProposalCard(proposal)}
                  ></ProposalCard>
                </div>
              ))}
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '32px',
                marginBottom: '32px',
              }}
            >
              <ANButton
                label="Load More Proposals"
                type="secondary"
                height="46px"
                width="196px"
                color="#00C2FF"
              ></ANButton>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </DaoPageMainDiv>
  );
};
