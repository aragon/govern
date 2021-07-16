import React from 'react';
import { styled } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import DaoProperty from './DaoProperty';
export interface DaoCardProps {
  /**
   * Label of the card - name of the DAO
   */
  label: string;

  /**
   * Number of Proposals
   */
  numberOfProposals: number;
  /**
   * function to be called on click.
   */
  onClick?: () => void;
}

const DaoCardWrapper = styled(MUICard)(({ theme }) => ({
  background: theme.custom.daoCard.background,
  // width: '328px',
  height: '161px',
  border: `2px ${theme.custom.daoCard.border}`,
  boxSizing: 'border-box',
  boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '32px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
}));

const CardLabel = styled(MUITypography)(({ theme }) => ({
  lineHeight: theme.custom.daoCard.labelLineHeight,
  fontSize: theme.custom.daoCard.labeFontSize,
  fontWeight: theme.custom.daoCard.labelFontWeight,
  fontFamily: theme.custom.daoCard.fontFamily,
  fontStyle: theme.custom.daoCard.fontStyle,
  background: theme.custom.daoCard.labelColor,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  padding: '0px 18px',
  marginBottom: '35px',
}));

export const DaoCard: React.FC<DaoCardProps> = ({ label, numberOfProposals }) => {
  return (
    <DaoCardWrapper>
      <CardLabel>{label}</CardLabel>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-evenly',
        }}
      >
        <div>
          <DaoProperty propertyLabel="TRANSACTIONS" propertyText={numberOfProposals.toString()} />
        </div>
      </div>
    </DaoCardWrapper>
  );
};
