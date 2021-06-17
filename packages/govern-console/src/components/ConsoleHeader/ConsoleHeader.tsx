import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import consoleHeaderGraphic from 'images/console-header.svg';
import { useSnackbar } from 'notistack';
import { Button, TextInput, Split, useLayout, SPACING } from '@aragon/ui';

const ConsoleHeaderCard = styled(MUICard)(({ theme }) => ({
  background: theme.custom.daoHeader.background,
  width: '100%',
  height: 'min-content',
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderRadius: '16px',
  display: 'flex',
  justifyContent: 'space-between',
}));

const Subtitle = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoHeader.labelColor,
  lineHeight: '27px',
  fontSize: '18px',
  fontWeight: theme.custom.daoHeader.labelFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

const Title = styled(MUITypography)(({ theme }: any) => ({
  color: theme.custom.daoHeader.valueColor,
  lineHeight: '60.1px',
  fontSize: '44px',
  fontWeight: theme.custom.daoHeader.valueFontWeight,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

const ConsoleImage = styled('img')({
  height: '100%',
  width: '400px',
  marginRight: '160px',
  marginTop: '60px',
  marginBottom: '-10px',
});

export const ConsoleHeader: React.FC = () => {
  const { layoutName } = useLayout();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [searchString, updateSearchString] = useState<string>('');

  const onInputChange = (val: string) => {
    updateSearchString(val);
  };

  const onGotoDao = () => {
    if (searchString.length > 0) {
      history.push(`daos/${searchString}`);
    } else {
      enqueueSnackbar('Invalid Dao Name. At least one letter should be entered.', {
        variant: 'error',
      });
    }
  };

  const onEnterKey = (event: any) => {
    if (event.key === 'Enter') {
      onGotoDao();
    }
  };

  return (
    <ConsoleHeaderCard>
      <div style={{ padding: SPACING[layoutName] * 2 }}>
        <div style={{ display: 'grid', gridGap: '24px' }}>
          <Title> Welcome to Aragon Console</Title>

          <Subtitle>
            Lorem ipsum dolor amet ipsu amet dolores ipsum amet dolor ipsum amet ipsum amet dolors
            ipsum{' '}
          </Subtitle>

          <Split
            primary={
              <TextInput
                wide
                placeholder="DAO Name"
                onChange={onInputChange}
                id="search-input"
                onKeyDown={onEnterKey}
              />
            }
            secondary={
              <Button
                wide={layoutName !== 'large'}
                type="primary"
                label="Go to DAO"
                size="large"
                onClick={onGotoDao}
              />
            }
          ></Split>
        </div>
      </div>
      {layoutName === 'large' && <ConsoleImage src={consoleHeaderGraphic} />}
    </ConsoleHeaderCard>
  );
};
