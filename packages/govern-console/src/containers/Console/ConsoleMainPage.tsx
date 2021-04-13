import React, { useRef, useState, useEffect } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import { ConsoleHeader } from '../../components/ConsoleHeader/ConsoleHeader';
import { DaoCard } from '../../components/DaoCards/DaoCard';
import { ANButton } from '../../components/Button/ANButton';
import Paper from '@material-ui/core/Paper';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { GET_DAO_LIST } from './queries';

export const ConsoleMainPage = ({ ...props }) => {
  const theme = useTheme();
  const [daoList, updateDaoList] = useState<any>([]);

  const ConsoleMainDiv = styled(Paper)({
    width: '100%',
    background: theme.custom.mainBackground,
    height: 'auto',
    padding: '0px',
    boxShadow: 'none',
  });

  const { data, loading, error, fetchMore } = useQuery(GET_DAO_LIST, {
    variables: {
      offset: 0,
      limit: 12,
    },
  });
  useEffect(() => {
    if (data && data.daos) {
      if (daoList.length > 0) {
        updateDaoList([...daoList, ...data.daos]);
      } else {
        //fetch extra data - Number of proposals and value
        updateDaoList(data.daos);
      }
    }
  }, [data]);
  return (
    <ConsoleMainDiv>
      <ConsoleHeader />
      <div
        style={{
          width: '100%',
          // maxWidth: '1408px',
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto',
          justifyContent: 'space-between',
        }}
      >
        {data &&
          data.daos.map((dao: any) => (
            <div style={{ marginTop: '32px' }} key={dao.id}>
              <DaoCard
                label={dao.name}
                aumValue={dao.executor.balance}
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
          marginTop: '32px',
          marginBottom: '32px',
        }}
      >
        <ANButton
          label="Load More DAOs"
          type="secondary"
          height="46px"
          width="163px"
          onClick={() => {
            debugger;
            fetchMore({
              variables: {
                offset: daoList.length,
                limit: 12,
              },
            });
          }}
        ></ANButton>
      </div>
    </ConsoleMainDiv>
  );
};
