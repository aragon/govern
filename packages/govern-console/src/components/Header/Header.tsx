import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import governIcon from 'images/aragon-icon.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';
import { ANButton } from 'components/Button/ANButton';

const HeaderWrapperDiv = styled('div')({
  height: '106px',
  width: '100%',
  display: 'block',
});
const TitleTextNormal = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '18px',
  lineHeight: '25px',
  color: '#7483B2',
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center',
  marginRight: '5px',
});
const TitleTextBold = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '25px',
  color: '#20232C',
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center',
});
const Navbar = styled('div')({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  height: '100%',
});
const Title = styled('div')({
  display: 'flex',
  width: 'fit-content',
  cursor: 'pointer',
  '& img': {},
});
const Account = styled('div')({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const Header = ({}) => {
  const history = useHistory();

  const redirectToHomePage = () => {
    history.push('/');
  };

  const goToCreateDaoPage = () => {
    history.push('/create-dao');
  };

  return (
    <HeaderWrapperDiv id="header">
      <Navbar id="navbar">
        <Title id="navbar_title" onClick={redirectToHomePage}>
          <img src={governIcon} />
          <TitleTextNormal>Govern</TitleTextNormal>
          <TitleTextBold>Console</TitleTextBold>
        </Title>
        <Account id="account">
          {/* <ChainSelector /> */}
          <div style={{ marginRight: '20px' }}>
            <Wallet />
          </div>
          <div>
            <ANButton
              buttonType="primary"
              onClick={goToCreateDaoPage}
              label={'Create DAO'}
              height={'48px'}
              width={'174px'}
              disabled={status === 'connecting'}
            ></ANButton>
          </div>
        </Account>
      </Navbar>
    </HeaderWrapperDiv>
  );
};

export default Header;
