import React, { memo } from 'react';
import { styled } from '@material-ui/core/styles';
import { Button } from '@aragon/ui';
import { useHistory } from 'react-router-dom';
import MUITypography from '@material-ui/core/Typography';
import daoNoutFound from 'images/dao-not-found.svg';

const VerticalAlignWrapper = styled('div')({
  height: 'fit-content',
  width: 'fit-content',
  margin: 'auto',
  padding: '120px 32px 0px 32px',
});

const Subtitle = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoHeader.labelColor,
  lineHeight: '27px',
  fontSize: '18px',
  fontWeight: 500,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
}));

const Title = styled(MUITypography)(({ theme }: any) => ({
  color: theme.custom.daoHeader.valueColor,
  lineHeight: '30px',
  fontSize: '24px',
  fontWeight: 600,
  fontFamily: theme.typography.fontFamily,
  fontStyle: 'normal',
  paddingBottom: '8px',
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

const NavigationbuttonContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: ' center',
  marginTop: '24px',
});

const NotFoundImage = styled('img')({
  width: '236px',
  height: '225px',
});

const NoPageFound: React.FC = () => {
  const history = useHistory();

  const onGotoDao = () => {
    history.push(`/`);
  };

  return (
    <>
      <DaoNotFoundWrapper>
        <VerticalAlignWrapper>
          <NotFoundImage src={daoNoutFound} />
          <Title>This page is lost.</Title>
          <Subtitle>
            We've explored deep and wide, but we can't find the page you were looking for.
          </Subtitle>
          <NavigationbuttonContainer>
            <Button
              buttonType="primary"
              type="submit"
              label="Navigate back home"
              height={'40px'}
              width={'186px'}
              onClick={onGotoDao}
            />
          </NavigationbuttonContainer>
        </VerticalAlignWrapper>
      </DaoNotFoundWrapper>
    </>
  );
};
export default memo(NoPageFound);
