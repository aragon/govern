/* eslint-disable */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { styled, useTheme } from '@material-ui/core/styles';
import MUICard, { CardProps } from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { ANButton } from '../Button/ANButton';
import SettingIconImage from '../../images/svgs/Setting_Icon.svg';
import { settingsUrl } from 'utils/urls';

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

const DaoHeaderCard = styled(MUICard)(({ theme }) => ({
  background: theme.custom.daoHeader.background,
  width: '100%',
  height: '197px',
  paddingLeft: '64px',
  paddingTop: '54px',
  paddingBottom: '53px',
  boxShadow: 'none',
  boxSizing: 'border-box',
}));

const HeaderLabel = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoHeader.labelColor,
  lineHeight: theme.custom.daoHeader.labelLineHeight,
  fontSize: theme.custom.daoHeader.labelFontSize,
  fontWeight: theme.custom.daoHeader.labelFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

const HeaderValue = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoHeader.valueColor,
  lineHeight: theme.custom.daoHeader.valueLineHeight,
  fontSize: theme.custom.daoHeader.valueFontSize,
  fontWeight: theme.custom.daoHeader.valueFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

const HeaderUsdBalance = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoHeader.valueColor,
  lineHeight: theme.custom.daoHeader.valueLineHeight,
  fontSize: theme.custom.daoHeader.labelFontSize,
  fontWeight: theme.custom.daoHeader.labelFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

export const DaoHeader: React.FC<DaoHeaderProps> = ({
  daoName,
  ethBalance,
  usdBalance,
  ...props
}) => {
  const history = useHistory();
  const theme = useTheme();

  const goToSettingPage = () => {
    history.push(settingsUrl(daoName));
  };

  return (
    <DaoHeaderCard>
      <div
        style={{
          display: 'flex',
          width: '100%',
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
        <div
          style={{
            marginRight: '60px',
          }}
        >
          <ANButton
            label={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
              >
                <img src={SettingIconImage} />
                <div style={{ marginLeft: '10px' }}>DAO Settings</div>
              </div>
            }
            buttonType={'secondary'}
            backgroundColor={'#FFFFFF'}
            buttonColor={'#20232C'}
            onClick={goToSettingPage}
          />
        </div>
      </div>
    </DaoHeaderCard>
  );
};
