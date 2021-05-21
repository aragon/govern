import React, { useState, useEffect, memo } from 'react';
import { styled } from '@material-ui/core/styles';
import { ConsoleHeader } from 'components/ConsoleHeader/ConsoleHeader';
import { DaoCard } from 'components/DaoCards/DaoCard';
import { ANButton } from 'components/Button/ANButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDaosSubscription, useGovernRegistrySubscription } from 'hooks/subscription-hooks';

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

const WrapperGrid = styled(Grid)({
  marginTop: '24px',
  boxSizing: 'border-box',
  margin: '0 !important',
  width: '100% !important',
});

const ConsoleMainPage: React.FC = () => {
  const history = useHistory();

  const [visibleDaoList, updateDaoList] = useState<any>([]);
  const [totalDaoCount, updateTotalDaoCount] = useState<number>();

  const { data: daoListData, fetchMore } = useDaosSubscription();
  const { data: daoRegistryData } = useGovernRegistrySubscription();

  useEffect(() => {
    if (daoListData && daoListData.daos) {
      updateDaoList(daoListData.daos);
    }
  }, [daoListData]);

  useEffect(() => {
    if (daoRegistryData) {
      updateTotalDaoCount(daoRegistryData.governRegistries[0].count);
    }
  }, [daoRegistryData]);

  const loadMore = async () => {
    if (fetchMore) {
      fetchMore({
        variables: {
          offset: visibleDaoList.length,
        },
      });
    }
  };

  const goToDao = (dao: any) => {
    history.push(`/daos/${dao.name}`);
  };

  return (
    <ConsoleMainDiv>
      <ConsoleHeader />
      <WrapperGrid container spacing={3} direction="row" justify="flex-start">
        {visibleDaoList &&
          visibleDaoList.length > 0 &&
          visibleDaoList.map((dao: any) => (
            <Grid
              item
              onClick={() => goToDao(dao)}
              key={dao.name}
              xl={3}
              lg={3}
              md={4}
              sm={6}
              xs={12}
            >
              <DaoCard label={dao.name} numberOfProposals={dao.queue.nonce}></DaoCard>
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
            labelColor="#00C2FF"
            onClick={loadMore}
          ></ANButton>
        ) : null}
      </div>
    </ConsoleMainDiv>
  );
};

export default memo(ConsoleMainPage);
