import React, { useState, memo } from 'react';
import { styled } from '@material-ui/core/styles';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import { useHistory } from 'react-router-dom';
import MUITypography from '@material-ui/core/Typography';
import daoNoutFound from 'images/dao-not-found.svg';
import { useSnackbar } from 'notistack';

const VerticalAlignWrapper = styled('div')({
  height: 'fit-content',
  width: 'fit-content',
  padding: '120px',
  margin: 'auto',
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

const DaoNotFoundWrapper = styled('div')({
  width: '100%',
  height: '100%',
  textAlign: 'center',
  background: ' linear-gradient(107.79deg, #E4F8FF 1.46%, #F1F1FF 100%)',
  borderRadius: '16px',
  boxSizing: 'border-box',
  position: 'relative',
});

const RowFlexDiv = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '22px',
});

const NotFoundImage = styled('img')({
  width: '236px',
  height: '225px',
});

const NoDaoFound: React.FC = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const onGotoDao = () => {
    if (daoSearchText.length > 0) {
      history.push(`${daoSearchText}`);
    } else {
      enqueueSnackbar('Invalid Dao Name. Atleast one letter should be entered.', {
        variant: 'error',
      });
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      onGotoDao();
    }
  };

  const [daoSearchText, updateDaoSearchText] = useState('');
  const onInputChange = (updatedText: string) => {
    updateDaoSearchText(updatedText);
  };

  return (
    <>
      <DaoNotFoundWrapper>
        <VerticalAlignWrapper>
          <NotFoundImage src={daoNoutFound} />
          <Title>DAO not found</Title>
          <Subtitle>You can try with other DAO name</Subtitle>
          <RowFlexDiv>
            <div style={{ marginRight: '10px' }}>
              <InputField
                placeholder="DAO Name"
                onInputChange={onInputChange}
                value={daoSearchText}
                onKeyPress={handleKeyPress}
                label=""
                height="46px"
                width="448px"
                id="search-input"
              />
            </div>
            <div>
              <ANButton
                buttonType="primary"
                type="submit"
                label="Go to DAO"
                height={'46px'}
                width={'116px'}
                onClick={onGotoDao}
              />
            </div>
          </RowFlexDiv>
        </VerticalAlignWrapper>
      </DaoNotFoundWrapper>
    </>
  );
};
export default memo(NoDaoFound);
