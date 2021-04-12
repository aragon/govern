import React, { useRef } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import { ConsoleHeader } from '../../components/ConsoleHeader/ConsoleHeader';
import { DaoCard } from '../../components/DaoCards/DaoCard';
import { ANButton } from '../../components/Button/ANButton';
import Paper from '@material-ui/core/Paper';

export interface ConsoleMainPageProps {
  /**
   * List of Daos
   */
  daoList?: any;
}

export const ConsoleMainPage: React.FC<ConsoleMainPageProps> = ({
  daoList,
  ...props
}) => {
  const theme = useTheme();

  const ConsoleMainDiv = styled(Paper)({
    width: '100%',
    background: theme.custom.mainBackground,
    height: 'auto',
    padding: '0px',
    boxShadow: 'none',
  });

  return (
    <ConsoleMainDiv>
      <ConsoleHeader />
      <div
        style={{
          width: '100%',
          maxWidth: '1408px',
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto',
          justifyContent: 'space-between',
        }}
      >
        {daoList.map((dao: any) => (
          <div style={{ marginTop: '32px' }} key={dao.id}>
            <DaoCard
              label={dao.name}
              aumValue={dao.aumValue}
              numberOfProposals={dao.numberOfProposals}
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
        ></ANButton>
      </div>
    </ConsoleMainDiv>
  );
};
