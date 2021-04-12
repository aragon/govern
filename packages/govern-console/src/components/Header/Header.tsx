import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import governIcon from 'images/aragon-icon.svg';
// import

const Header = ({}) => {
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
    width: 'fit-content',
    '& img': {},
  });
  const Navbar = styled('div')({
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: '100%',
  });
  const Title = styled('div')({
    display: 'block',
    width: 'fit-content',
    cursor: 'pointer',
  });
  const Account = styled('div')({
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  });
  return (
    <HeaderWrapperDiv id="header">
      <Navbar id="navbar">
        <Title id="navbar_title">
          <img src={governIcon} />
          <TitleText>Govern Console</TitleText>
        </Title>
        <Account id="account">
          {/* <ChainSelector /> */}
          {/* <Wallet /> */}
        </Account>
      </Navbar>
    </HeaderWrapperDiv>
  );
};

export default Header;
