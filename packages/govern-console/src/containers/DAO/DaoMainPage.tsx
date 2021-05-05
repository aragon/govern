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
import Grid from '@material-ui/core/Grid';
import { useHistory, useParams } from 'react-router-dom';
import MUITypography from '@material-ui/core/Typography';
import NoDaoFound from './NoDaoFound';

//* Styled Components List
const DaoPageMainDiv = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: theme.custom.white,
  height: 'calc(100% - 60px)',
  padding: '0px',
  boxSizing: 'border-box',
  boxShadow: 'none',
}));
const VerticalAlignWrapper = styled('div')(({ theme }) => ({
  transform: 'translate(-50%, -50%)',
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: 'fit-content',
  width: 'fit-content',
  margin: 'auto',
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

const Subtitle = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoHeader.labelColor,
  lineHeight: '27px',
  fontSize: '18px',
  fontWeight: theme.custom.daoHeader.labelFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

const Title = styled(MUITypography)(({ theme }: any) => ({
  color: theme.custom.daoHeader.valueColor,
  lineHeight: '60.1px',
  fontSize: '44px',
  fontWeight: theme.custom.daoHeader.valueFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

const DaoNotFoundWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  textAlign: 'center',
  background: ' linear-gradient(107.79deg, #E4F8FF 1.46%, #F1F1FF 100%)',
  borderRadius: '16px',
  boxSizing: 'border-box',
  position: 'relative',
}));

const WrapperGrid = styled(Grid)(({ theme }) => ({
  marginTop: '16px',
  boxSizing: 'border-box',
  margin: '0 !important',
  width: '100% !important',
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
    variables: { name: `%${daoName}%` },
  });

  const [isProposalPage, setProposalPage] = useState(true);
  const [visibleProposalList, updateVisibleProposalList] = useState<any>([]);
  const [queueNonce, updateQueueNonce] = useState<number>();
  const [fetchMoreProposal, updateFetchMoreProposals] = useState<any>();
  const [isProfilePage, setProfilePage] = useState(false);
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [isAnExistingDao, updateIsAnExistingDao] = useState<boolean>(true);
  const [searchDaoName, setSearchDaoName] = useState('');

  // useEffect(() => {
  //   if (isProfile) {
  //     setProposalPage(false);
  //     setProfilePage(true);
  //   }
  // }, [isProfile]);

  const onInputChange = (val: string) => {
    setSearchDaoName(val);
  };
  const onSearch = () => {
    console.log(searchDaoName);
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
    debugger;
    if (loadingDao) return;
    if (daoList.daos.length > 0) {
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
    } else {
      updateIsAnExistingDao(false);
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

  return (
    <DaoPageMainDiv id="Wrapper">
      {isAnExistingDao ? (
        daoDetails === undefined ? (
          'loading'
        ) : (
          <>
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
                  <WrapperGrid
                    container
                    spacing={3}
                    xs={12}
                    direction="row"
                    justify="center"
                  >
                    {visibleProposalList.map((proposal: any) => (
                      <Grid
                        item
                        key={proposal.id}
                        xl={3}
                        lg={4}
                        xs={12}
                        sm={12}
                        md={6}
                      >
                        <ProposalCard
                          transactionHash={proposal.id}
                          proposalDate={
                            // TODO:Bhanu you can make this work with the dates library you use
                            new Date(
                              proposal.createdAt * 1000,
                            ).toLocaleDateString('en-US') +
                            ' ' +
                            new Date(
                              proposal.createdAt * 1000,
                            ).toLocaleTimeString('en-US')
                          }
                          proposalStatus={proposal.state}
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
          </>
        )
      ) : (
        <>
          <NoDaoFound />
        </>
      )}
    </DaoPageMainDiv>
  );
};
export default memo(DaoMainPage);
