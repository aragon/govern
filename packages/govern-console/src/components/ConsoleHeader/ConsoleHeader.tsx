import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { InputField } from '../InputFields/InputField';
import { ANButton } from '../Button/ANButton';
import { useHistory } from 'react-router-dom';
import consoleHeaderGraphic from 'images/console-header.svg';
import { useSnackbar } from 'notistack';

const ConsoleHeaderCard = styled(MUICard)(({ theme }) => ({
  background: theme.custom.daoHeader.background,
  width: '100%',
  height: '335px',
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderRadius: '16px',
  display: 'flex',
  justifyContent: 'space-between',
}));

const LeftWrapper = styled('div')({
  maxWidth: '900px',
  width: 'fit-content',
  paddingLeft: '76px',
  paddingTop: '61px',
  paddingBottom: '82px',
  boxSizing: 'border-box',
});
const RightWrapper = styled('div')({
  width: 'fit-content',
  height: '100%',
  paddingRight: '150px',
  boxSizing: 'border-box',
});

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
});

export const ConsoleHeader: React.FC = () => {
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

  return (
    <ConsoleHeaderCard>
      <LeftWrapper>
        <Title> Welcome to Aragon Console</Title>
        <div style={{ maxWidth: '480px', marginTop: '7px' }}>
          <Subtitle>
            Lorem ipsum dolor amet ipsu amet dolores ipsum amet dolor ipsum amet ipsum amet dolors
            ipsum{' '}
          </Subtitle>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '22px' }}>
          <div style={{ marginRight: '10px' }}>
            <InputField
              placeholder="DAO Name"
              onInputChange={onInputChange}
              label=""
              height="46px"
              width="448px"
              id="search-input"
            />
          </div>
          <div>
            <ANButton
              buttonType="primary"
              label="Go to DAO"
              height={'46px'}
              width={'116px'}
              onClick={onGotoDao}
            />
          </div>
        </div>
      </LeftWrapper>
      <RightWrapper>
        <ConsoleImage src={consoleHeaderGraphic} />
      </RightWrapper>
    </ConsoleHeaderCard>
  );
};
