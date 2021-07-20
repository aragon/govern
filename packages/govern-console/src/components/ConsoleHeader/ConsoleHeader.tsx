import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import consoleHeaderGraphic from 'images/console-header.svg';
import { Button, TextInput, Split, useLayout, useToast, SPACING, Link } from '@aragon/ui';

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
  const toast = useToast();
  const history = useHistory();
  const [searchString, updateSearchString] = useState<string>('');

  const onInputChange = (event: any) => {
    updateSearchString(event.target.value);
  };

  const onGotoDao = () => {
    if (searchString.length > 0) {
      history.push(`daos/${searchString}`);
    } else {
      toast('Invalid DAO Name. At least one letter should be entered.');
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
          <Title>Govern</Title>

          <Subtitle>
            Full-stack, frictionless DAOs: signal on{' '}
            <Link href="https://voice.aragon.org/">Voice</Link>, schedule on Govern, dispute in{' '}
            <Link href="https://court.aragon.org/">Court</Link>.
          </Subtitle>

          <Split
            primary={
              <TextInput
                wide
                placeholder="Search DAOs"
                onChange={onInputChange}
                onKeyDown={onEnterKey}
              />
            }
            secondary={
              <Button
                wide={layoutName !== 'large'}
                type="primary"
                label="Search"
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
