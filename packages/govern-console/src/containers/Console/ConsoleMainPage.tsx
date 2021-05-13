import React, { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { ConsoleHeader } from 'components/ConsoleHeader/ConsoleHeader';
import { DaoCard } from 'components/DaoCards/DaoCard';
import { ANButton } from 'components/Button/ANButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_DAO_LIST, GET_GOVERN_REGISTRY_DATA, GET_DAO_BY_NAME } from './queries';
import { Link, useHistory } from 'react-router-dom';
import { formatEther } from 'ethers/lib/utils';
export interface ConsoleMainPageProps {
  /**
   * Callback on selection of Dao
   */
  updateSelectedDao: any;
  /**
   * Callback to navigate the user to the search DAO by name result page
   */
  onSearchByDaoName: (daoName: string) => void;
}

const ConsoleMainDiv = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: theme.custom.mainBackground,
  height: 'auto',
  padding: '0px',
  boxShadow: 'none',
}));

const WrapperGrid = styled(Grid)(({ theme }) => ({
  marginTop: '24px',
  boxSizing: 'border-box',
  margin: '0 !important',
  width: '100% !important',
}));

const ConsoleMainPage: React.FC<ConsoleMainPageProps> = ({ updateSelectedDao, ...props }) => {
  const history = useHistory();
  const [visibleDaoList, updateDaoList] = useState<any>([]);
  const [totalDaoCount, updateTotalDaoCount] = useState<number>();

  const {
    data: daoListData,
    loading: isLoadingDaoList,
    error: errorLoadingDaoList,
    fetchMore: fetchMoreDaos,
  } = useQuery(GET_DAO_LIST, {
    variables: {
      offset: 0,
      limit: 12,
    },
  });

  const {
    data: daoRegistryData,
    loading: isLoadingRegistryData,
    error: errorLoadingRegistryData,
  } = useQuery(GET_GOVERN_REGISTRY_DATA);

  useEffect(() => {
    if (daoListData && daoListData.daos) {
      updateDaoList([...daoListData.daos]);
    }
  }, [daoListData]);

  useEffect(() => {
    if (daoRegistryData) {
      updateTotalDaoCount(daoRegistryData.governRegistries[0].count);
    }
  }, [daoRegistryData]);

  const fetchMoreData = async () => {
    const {
      data: moreData,
      loading: loadingMore,
    }: { data: any; loading: boolean } = await fetchMoreDaos({
      variables: {
        offset: visibleDaoList.length,
      },
    });
    if (moreData && moreData.daos.length > 0) {
      updateDaoList([...visibleDaoList, ...moreData.daos]);
    }
  };

  const goToDao = (dao: any) => {
    history.push(`/daos/${dao.name}`);
  };

  return (
    <ConsoleMainDiv>
      <ConsoleHeader />
      <WrapperGrid container spacing={3} xs={12} direction="row" justify="center">
        {visibleDaoList &&
          visibleDaoList.length > 0 &&
          visibleDaoList.map((dao: any) => (
            <Grid
              item
              onClick={() => goToDao(dao)}
              key={dao.name}
              xl={2}
              lg={3}
              xs={6}
              sm={4}
              md={3}
            >
              <DaoCard
                label={dao.name}
                aumValue={formatEther(0)}
                numberOfProposals={dao.queue.nonce}
                daoId={dao.id}
              ></DaoCard>
            </Grid>
          ))}
      </WrapperGrid>

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '46px',
          marginBottom: '80px',
        }}
      >
        {totalDaoCount !== visibleDaoList.length ? (
          <ANButton
            label="Load More DAOs"
            buttonType="secondary"
            height="46px"
            width="163px"
            buttonColor="#00C2FF"
            onClick={fetchMoreData}
          ></ANButton>
        ) : null}
      </div>
    </ConsoleMainDiv>
  );
};

export default React.memo(ConsoleMainPage);
