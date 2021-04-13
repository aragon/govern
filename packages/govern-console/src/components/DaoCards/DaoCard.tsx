import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import MUICard, { CardProps } from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';

export interface DaoCardProps {
  /**
   * Label of the card - name of the DAO
   */
  label: string;
  /**
   * Aum Value of the DAO
   */
  aumValue: string | number;
  /**
   * Number of Proposals
   */
  numberOfProposals: number;
  /**
   * ID of the DAO
   */
  daoId: number | string;
  /**
   * function to be called on click.
   */
  onClick?: () => void;
}

export const DaoCard: React.FC<DaoCardProps> = ({
  label,
  aumValue,
  numberOfProposals,
  daoId,
  ...props
}) => {
  const theme = useTheme();
  const DaoCard = styled(MUICard)({
    background: theme.custom.daoCard.background,
    width: '328px',
    height: '161px',
    border: `2px ${theme.custom.daoCard.border}`,
    boxSizing: 'border-box',
    boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  });

  const CardLabel = styled(MUITypography)({
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
  });

  const DaoPropertyLabel = styled(MUITypography)({
    color: theme.custom.daoCard.propertyLabelColor,
    lineHeight: theme.custom.daoCard.propertyLabelLineHeight,
    fontSize: theme.custom.daoCard.propertLabelFontSize,
    fontWeight: theme.custom.daoCard.propertyLabelFontWeight,
    fontFamily: theme.custom.daoCard.fontFamily,
    fontStyle: theme.custom.daoCard.fontStyle,
  });

  const DaoPropertyText = styled(MUITypography)({
    color: theme.custom.daoCard.propertyTextColor,
    lineHeight: theme.custom.daoCard.propertyTextLineHeight,
    fontSize: theme.custom.daoCard.propertyTextFontSize,
    fontWeight: theme.custom.daoCard.propertyTextFontWeight,
    fontFamily: theme.custom.daoCard.fontFamily,
    fontStyle: theme.custom.daoCard.fontStyle,
  });

  const DaoProperty: React.FC<any> = ({ propertyLabel, propertyText }) => {
    return (
      <div
        style={{
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <DaoPropertyLabel>{propertyLabel}</DaoPropertyLabel>
        <DaoPropertyText>{propertyText}</DaoPropertyText>
      </div>
    );
  };

  return (
    <DaoCard>
      <CardLabel>{label}</CardLabel>
      <div
        style={{
          display: 'flex',
          width: '202px',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <DaoProperty
            propertyLabel="AUM(USD)"
            propertyText={'$' + aumValue + 'M'}
          />
        </div>
        <div>
          <DaoProperty
            propertyLabel="PROPOSALS"
            propertyText={numberOfProposals}
          />
        </div>
      </div>
    </DaoCard>
  );
};
