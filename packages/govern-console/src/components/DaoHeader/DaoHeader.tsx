import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { settingsUrl } from 'utils/urls';
import { Button, IconSettings, Grid, useToast } from '@aragon/ui';
import { ActionBuilder } from 'components/ActionBuilder/ActionBuilder';
import { useWallet } from 'AugmentedWallet';
import { Error } from 'utils/Error';

export interface DaoHeaderProps {
  /**
   * Label of the card - name of the DAO
   */
  daoName: string;
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

export const DaoHeader: React.FC<DaoHeaderProps> = ({ daoName }) => {
  const history = useHistory();
  const [isDepositDialogOpen, setDepositDialogOpen] = useState(false);

  const context: any = useWallet();
  const { isConnected } = context;
  const toast = useToast();

  const goToSettingPage = () => {
    history.push(settingsUrl(daoName));
  };

  const openDepositDialog = useCallback(() => {
    if (!isConnected) {
      toast(Error.ConnectAccount);
      return;
    }
    setDepositDialogOpen(true);
  }, [setDepositDialogOpen, toast, isConnected]);

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
        <Grid
          style={{
            marginRight: '60px',
          }}
        >
          <Button
            size="large"
            mode="secondary"
            label="DAO Settings"
            icon={<IconSettings />}
            onClick={goToSettingPage}
          ></Button>
          <Button
            size="large"
            mode="secondary"
            label="Deposit"
            onClick={openDepositDialog}
          ></Button>
        </Grid>
      </div>
      {isDepositDialogOpen && (
        <ActionBuilder
          initialState="deposit"
          visible={isDepositDialogOpen}
          onClose={() => setDepositDialogOpen(false)}
        ></ActionBuilder>
      )}
    </DaoHeaderCard>
  );
};
