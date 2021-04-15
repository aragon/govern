import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import MUICard, { CardProps } from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';

export interface DaoHeaderProps {
  /**
   * Label of the card - name of the DAO
   */
  daoName: string;
  /**
   * Value in Ether
   */
  ethBalance: string | number;
  /**
   * Value in USD
   */
  usdBalance: number | string;
  /**
   * logo of the DAO
   */
  logoUrl?: string;
}

export const DaoHeader: React.FC<DaoHeaderProps> = ({
  daoName,
  ethBalance,
  usdBalance,
  ...props
}) => {
  const theme = useTheme();
  const DaoHeaderCard = styled(MUICard)({
    background: theme.custom.daoHeader.background,
    width: '100%',
    height: '197px',
    paddingLeft: '64px',
    paddingTop: '54px',
    paddingBottom: '53px',
    boxShadow: 'none',
    boxSizing: 'border-box',
  });

  const HeaderLabel = styled(MUITypography)({
    color: theme.custom.daoHeader.labelColor,
    lineHeight: theme.custom.daoHeader.labelLineHeight,
    fontSize: theme.custom.daoHeader.labelFontSize,
    fontWeight: theme.custom.daoHeader.labelFontWeight,
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'normal',
  });

  const HeaderValue = styled(MUITypography)({
    color: theme.custom.daoHeader.valueColor,
    lineHeight: theme.custom.daoHeader.valueLineHeight,
    fontSize: theme.custom.daoHeader.valueFontSize,
    fontWeight: theme.custom.daoHeader.valueFontWeight,
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'normal',
  });

  const HeaderUsdBalance = styled(MUITypography)({
    color: theme.custom.daoHeader.valueColor,
    lineHeight: theme.custom.daoHeader.valueLineHeight,
    fontSize: theme.custom.daoHeader.labelFontSize,
    fontWeight: theme.custom.daoHeader.labelFontWeight,
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'normal',
  });

  return (
    <DaoHeaderCard>
      <div
        style={{
          display: 'flex',
          width: '850px',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <HeaderLabel>DAO Name</HeaderLabel>
          <HeaderValue>{daoName}</HeaderValue>
        </div>
        <div>
          <HeaderLabel>ETH DAO Balance</HeaderLabel>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <HeaderValue>{ethBalance}</HeaderValue>
            <HeaderUsdBalance style={{ marginLeft: '15px' }}>
              {'$ ' + usdBalance}
            </HeaderUsdBalance>
          </div>
        </div>
      </div>
    </DaoHeaderCard>
  );
};
