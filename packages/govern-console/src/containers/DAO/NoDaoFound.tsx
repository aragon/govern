/* eslint-disable */
import React, { useRef, useState, useEffect, memo } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import { DaoHeader } from 'components/DaoHeader/DaoHeader';
import { ProposalCard } from 'components/ProposalCards/ProposalCard';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { GET_PROPOSAL_LIST, GET_DAO_BY_NAME } from './queries';
import { useQuery, useLazyQuery } from '@apollo/client';
import { formatEther } from 'ethers/lib/utils';
import { useHistory, useParams } from 'react-router-dom';
import MUITypography from '@material-ui/core/Typography';
import daoNoutFound from 'images/dao-not-found.svg';
import { useSnackbar } from 'notistack';

//* Styled Components List

const VerticalAlignWrapper = styled('div')(({ theme }) => ({
  height: 'fit-content',
  width: 'fit-content',
  padding: '120px',
  margin: 'auto',
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

const DaoNotFoundWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  textAlign: 'center',
  background: ' linear-gradient(107.79deg, #E4F8FF 1.46%, #F1F1FF 100%)',
  borderRadius: '16px',
  boxSizing: 'border-box',
  position: 'relative',
}));
const RowFlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '22px',
}));
//* Styled Components List End

const NoDaoFound: React.FC<{}> = ({ ...props }) => {
  const history = useHistory();

  const { daoName } = useParams<any>();
  //TODO daoname empty handling
  const { enqueueSnackbar } = useSnackbar();

  const onGotoDao = () => {
    if (daoSearchText.length > 0) {
      history.push(`${daoSearchText}`);
    } else {
      enqueueSnackbar(
        'Invalid Dao Name. At least one letter should be entered.',
        { variant: 'error' },
      );
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      onGotoDao();
    }
  };

  const { data: daoList, loading: loadingDao } = useQuery(GET_DAO_BY_NAME, {
    variables: { name: daoName },
  });

  const [daoSearchText, updateDaoSearchText] = useState('');
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const onInputChange = (updatedText: string) => {
    updateDaoSearchText(updatedText);
  };

  return (
    //TODO extract to another component and remove inline styles
    <>
      <DaoNotFoundWrapper>
        <VerticalAlignWrapper>
          <img width="236px" height="225px" src={daoNoutFound} />
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
