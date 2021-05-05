/* eslint-disable */
import React, { useRef, useState, useEffect, memo } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import { DaoHeader } from 'components/DaoHeader/DaoHeader';
import { ProposalCard } from 'components/ProposalCards/ProposalCard';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { GET_PROPOSAL_LIST, GET_DAO_BY_NAME } from './queries';
import { useQuery, useLazyQuery } from '@apollo/client';
import { formatEther } from 'ethers/lib/utils';
import { useHistory, useParams } from 'react-router-dom';

//* Styled Components List
const DaoPageMainDiv = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: theme.custom.white,
  height: 'auto',
  padding: '0px',
  boxShadow: 'none',
}));

const PageLabelSelected = styled(Typography)(({ theme }) => ({
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
}));

const PageLabel = styled(Typography)(({ theme }) => ({
  color: '#7483AB',
  lineHeight: '25px',
  fontSize: '20px',
  fontWeight: 500,
  fontFamily: theme.custom.daoCard.fontFamily,
  fontStyle: theme.custom.daoCard.fontStyle,
  cursor: 'pointer',
}));
//* Styled Components List End

const DaoMainPage: React.FC<{
  onClickProposalCard: any;
  onClickNewProposal: any;
}> = ({ onClickProposalCard, onClickNewProposal, ...props }) => {
  const history = useHistory();
  const theme = useTheme();
  const { daoName } = useParams<any>();
  //TODO daoname empty handling

  const { data: daoList, loading: loadingDao } = useQuery(GET_DAO_BY_NAME, {
    variables: { name: daoName },
  });

  const [isProposalPage, setProposalPage] = useState(true);
  const [visibleProposalList, updateVisibleProposalList] = useState<any>([]);
  const [queueNonce, updateQueueNonce] = useState<number>();
  const [fetchMoreProposal, updateFetchMoreProposals] = useState<any>();
  const [isProfilePage, setProfilePage] = useState(false);
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [searchString, setSearchString] = useState('');

  // useEffect(() => {
  //   if (isProfile) {
  //     setProposalPage(false);
  //     setProfilePage(true);
  //   }
  // }, [isProfile]);

  const onInputChange = (val: string) => {
    setSearchString(val);
  };
  const onSearch = () => {
    console.log(searchString);
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

  const [
    getQueueData,
    {
      loading: loadingProposals,
      data: queueData,
      error: proposalErrors,
      fetchMore: fetchMoreProposals,
    },
  ] = useLazyQuery(GET_PROPOSAL_LIST);

  const fetchMoreData = async () => {
    if (fetchMoreProposals) {
      const {
        data: moreData,
        loading: loadingMore,
      }: { data: any; loading: boolean } = await fetchMoreProposals({
        variables: {
          offset: visibleProposalList.length,
        },
      });
      if (moreData && moreData.governQueue.containers.length > 0) {
        updateVisibleProposalList([
          ...visibleProposalList,
          ...moreData.governQueue.containers,
        ]);
      }
    }
  };

  useEffect(() => {
    if (daoList) {
      updateDaoDetails(daoList.daos[0]);
      if (daoList.daos[0] && daoList.daos[0].queue) {
        getQueueData({
          variables: {
            offset: 0,
            limit: 16,
            id: daoList.daos[0].queue.id,
          },
        });
      }
    }
  }, [daoList]);

  useEffect(() => {
    if (queueData) {
      updateVisibleProposalList(queueData.governQueue.containers);
      updateQueueNonce(parseInt(queueData.governQueue.nonce));
    }
  }, [queueData]);

  console.log(visibleProposalList, ' good');

  const onClickProposal = (proposal: any) => {
    history.push(`/proposals/${daoName}/${proposal.id}`);
  };

  const goToNewProposal = () => {
    history.push(`/daos/${daoName}/new-proposal`);
  };
  if (loadingDao) {
    return <div>Loading...</div>;
  }

  if (daoDetails) {
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
                  buttonType="primary"
                  height="46px"
                  width="142px"
                  onClick={goToNewProposal}
                ></ANButton>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'left',
                  gridGap: '0px 24px',
                }}
              >
                {visibleProposalList.map((proposal: any) => (
                  <div style={{ marginTop: '16px' }} key={proposal.id}>
                    <ProposalCard
                      transactionHash={proposal.id}
                      proposalDate={
                        // TODO:Bhanu you can make this work with the dates library you use
                        new Date(proposal.createdAt * 1000).toLocaleDateString(
                          'en-US',
                        ) +
                        ' ' +
                        new Date(proposal.createdAt * 1000).toLocaleTimeString(
                          'en-US',
                        )
                      }
                      proposalStatus={proposal.state}
                      onClickProposalCard={() => onClickProposal(proposal)}
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
                {queueNonce !== visibleProposalList.length ? (
                  <ANButton
                    label="Load More Proposals"
                    buttonType="secondary"
                    height="46px"
                    width="196px"
                    buttonColor="#00C2FF"
                    onClick={fetchMoreData}
                  ></ANButton>
                ) : null}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </DaoPageMainDiv>
    );
  }
  return <div> No Dao with this name. </div>;
};
export default memo(DaoMainPage);
