import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import governIcon from 'images/aragon-icon.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';

const Header = ({}) => {
  const history = useHistory();
  const HeaderWrapperDiv = styled('div')({
    height: '106px',
    width: '100%',
    display: 'block',
  });
  const TitleText = styled(Typography)({
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '25px',
    color: '#7483B2',
    width: '200px',
    display: 'flex',
    justifyContent: 'center',
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

  const redirectToHomePage = () => {
    history.push('/');
  };

  return (
    <HeaderWrapperDiv id="header">
      <Navbar id="navbar">
        <Title id="navbar_title" onClick={redirectToHomePage}>
          <img src={governIcon} />
          <TitleText>Govern Console</TitleText>
        </Title>
        <Account id="account">
          {/* <ChainSelector /> */}
          <Wallet />
        </Account>
      </Navbar>
    </HeaderWrapperDiv>
  );
};

export default Header;
