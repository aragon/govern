import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import { ConsoleHeader } from '../../components/ConsoleHeader/ConsoleHeader';
import { DaoCard } from '../../components/DaoCards/DaoCard';
import { ANButton } from '../../components/Button/ANButton';
import Paper from '@material-ui/core/Paper';
import { useQuery, useLazyQuery } from '@apollo/client';
import {
  GET_DAO_LIST,
  GET_GOVERN_REGISTRY_DATA,
  GET_DAO_BY_NAME,
} from './queries';
import { Link } from 'react-router-dom';
import { formatEther } from 'ethers/lib/utils';
export interface ConsoleMainPageProps {
  /**
   * Callback on selection of Dao
   */
  updateSelectedDao: any;
}

const ConsoleMainPage: React.FC<ConsoleMainPageProps> = ({
  updateSelectedDao,
  ...props
}) => {
  const theme = useTheme();
  const [visibleDaoList, updateDaoList] = useState<any>([]);
  const [filteredDaoList, updateFilteredDaoList] = useState<any>([]);
  const [
    isShowingFilteredResults,
    updateIsShowingFilteredResults,
  ] = useState<boolean>(false);
  const [totalDaoCount, updateTotalDaoCount] = useState<number>();

  const ConsoleMainDiv = styled(Paper)({
    width: '100%',
    background: theme.custom.mainBackground,
    height: 'auto',
    padding: '0px',
    boxShadow: 'none',
  });

  const {
    data: daoListData,
    loading: isLoadingDaoList,
    error: errorLoadingDaoList,
    fetchMore: fetchMoreDaos,
  } = useQuery(GET_DAO_LIST, {
    variables: {
      offset: 0,
      limit: 1,
    },
  });

  const {
    data: daoRegistryData,
    loading: isLoadingRegistryData,
    error: errorLoadingRegistryData,
  } = useQuery(GET_GOVERN_REGISTRY_DATA);

  // const getTotalNumberOfDaos = () => {
  //   updateTotalDaoCount(numberOfDaos);
  // };

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

  return (
    <ConsoleMainDiv>
      <ConsoleHeader />
      <div
        style={{
          width: '100%',
          // maxWidth: '1408px',
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto',
          justifyContent: 'left',
          gridGap: '0px 32px',
        }}
      >
        {visibleDaoList &&
          visibleDaoList.length > 0 &&
          visibleDaoList.map((dao: any) => (
            <div
              style={{ marginTop: '32px', width: '328px' }}
              onClick={() => updateSelectedDao(dao)}
              key={dao.name}
            >
              <DaoCard
                label={dao.name}
                aumValue={formatEther(dao.executor.balance)}
                numberOfProposals={dao.queue.nonce}
                daoId={dao.id}
              ></DaoCard>
            </div>
          ))}
      </div>
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
            type="secondary"
            height="46px"
            width="163px"
            color="#00C2FF"
            onClick={fetchMoreData}
          ></ANButton>
        ) : null}
      </div>
    </ConsoleMainDiv>
  );
};

export default React.memo(ConsoleMainPage);
