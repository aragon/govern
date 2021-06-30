import React, { useState, useEffect, memo } from 'react';
import { styled } from '@material-ui/core/styles';
import { DaoHeader } from 'components/DaoHeader/DaoHeader';
import { ProposalCard } from 'components/ProposalCards/ProposalCard';
import { ANButton } from 'components/Button/ANButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useHistory, useParams } from 'react-router-dom';
import NoDaoFound from './NoDaoFound';
import { formatDate } from 'utils/date';
import { getState, getStateColor } from 'utils/states';
import { useDaoQuery, useLazyProposalListQuery } from 'hooks/query-hooks';
import { proposalDetailsUrl } from 'utils/urls';

//* Styled Components List
const DaoPageMainDiv = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: theme.custom.white,
  minHeight: 'inherit',
  padding: '0px',
  boxSizing: 'border-box',
  boxShadow: 'none',
}));

const PageLabelSelected = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(282.07deg, #01E8F7 -5.08%, #01DCFA 21.97%, #00C2FF 81.4%)',
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

const WrapperGrid = styled(Grid)({
  marginTop: '16px',
  boxSizing: 'border-box',
  margin: '0 !important',
  width: '100% !important',
});
//* Styled Components List End

const DaoMainPage: React.FC = () => {
  const history = useHistory();
  const { daoName } = useParams<any>();
  //TODO daoname empty handling

  const { data: dao, loading: loadingDao } = useDaoQuery(daoName);

  const [isProposalPage, setProposalPage] = useState(true);
  const [visibleProposalList, updateVisibleProposalList] = useState<any>([]);
  const [queueNonce, updateQueueNonce] = useState<number>();
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [isAnExistingDao, updateIsAnExistingDao] = useState<boolean>(true);

  const onPageChange = (page: string) => {
    if (page === 'profile') {
      setProposalPage(false);
      // setProfilePage(true);
    } else {
      setProposalPage(true);
      // setProfilePage(false);
    }
  };

  const { getQueueData, data, fetchMore } = useLazyProposalListQuery();

  const fetchMoreData = async () => {
    if (fetchMore) {
      fetchMore({
        variables: {
          offset: visibleProposalList.length,
        },
      });
    }
  };

  useEffect(() => {
    if (data) {
      updateVisibleProposalList(data.governQueue.containers);
      updateQueueNonce(parseInt(data.governQueue.nonce));
    }
  }, [data]);

  useEffect(() => {
    if (loadingDao) return;

    if (dao && getQueueData) {
      updateIsAnExistingDao(true);
      updateDaoDetails(dao);
      if (dao && dao.queue) {
        getQueueData({
          variables: {
            offset: 0,
            limit: 16,
            id: dao.queue.id,
          },
        });
      }
    } else {
      updateIsAnExistingDao(false);
    }
  }, [loadingDao, dao, getQueueData]);

  const onClickProposal = (proposal: any) => {
    history.push(proposalDetailsUrl(daoName, proposal.id));
  };

  const goToNewExecution = () => {
    history.push(`/daos/${daoName}/new-execution`);
  };

  if (loadingDao) {
    return <div>Loading...</div>;
  }

  if (isAnExistingDao) {
    return (
      <DaoPageMainDiv id="dao-page-wrapper">
        {daoDetails === undefined ? (
          'loading'
        ) : (
          <>
            <DaoHeader daoName={daoDetails.name} />
            <div
              style={{
                paddingTop: '33px',
                paddingRight: '48px',
                paddingLeft: '48px',
                paddingBottom: '52px',
                boxSizing: 'border-box',
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
                  <PageLabelSelected>Executions</PageLabelSelected>
                ) : (
                  <PageLabel onClick={() => onPageChange('proposal')}>Proposal</PageLabel>
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
                      justifyContent: 'flex-end',
                      marginTop: '28px',
                    }}
                  >
                    <ANButton
                      label="New Execution"
                      buttonType="primary"
                      height="46px"
                      width="142px"
                      onClick={goToNewExecution}
                      style={{ marginRight: '12px' }}
                    ></ANButton>
                  </div>
                  <WrapperGrid container spacing={3} direction="row" justify="flex-start">
                    {visibleProposalList.map((proposal: any) => (
                      <Grid item key={proposal.id} xl={3} lg={4} xs={12} sm={12} md={6}>
                        <ProposalCard
                          transactionHash={proposal.id}
                          proposalTitle={proposal.payload.title}
                          proposalDate={formatDate(proposal.createdAt)}
                          proposalStatus={getState(proposal.state, proposal.payload.executionTime)}
                          proposalStatusColor={getStateColor(
                            proposal.state,
                            proposal.payload.executionTime,
                          )}
                          onClickProposalCard={() => onClickProposal(proposal)}
                        ></ProposalCard>
                      </Grid>
                    ))}
                  </WrapperGrid>

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
                        label="Load More Executions"
                        buttonType="secondary"
                        height="46px"
                        width="196px"
                        labelColor="#00C2FF"
                        onClick={fetchMoreData}
                      ></ANButton>
                    ) : null}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </DaoPageMainDiv>
    );
  } else {
    return <NoDaoFound />;
  }
};
export default memo(DaoMainPage);
