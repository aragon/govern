import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import governIcon from 'images/aragon-icon.svg';
import aragonText from 'images/svgs/Aragon.svg';
import discordIcon from 'images/svgs/discord.svg';
import messageIcon from 'images/svgs/message.svg';
import twitterIcon from 'images/svgs/twitter.svg';
import youtubeIcon from 'images/svgs/youtube.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';

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
  justifyContent: 'space-between',
  height: '100%',
});
const Title = styled('div')({
  display: 'flex',
  width: 'fit-content',
  cursor: 'pointer',
  marginLeft: '50px',
});
const Account = styled('div')({
  display: 'flex',
  width: '200px',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginRight: '50px',
});

const Footer = ({}) => {
  const history = useHistory();

  const redirectToHomePage = () => {
    history.push('/');
  };

  return (
    <HeaderWrapperDiv id="header">
      <Navbar id="navbar">
        <Title id="navbar_title" onClick={redirectToHomePage}>
          <img
            src={governIcon}
            style={{ height: '31px', width: '35px', paddingTop: '35px' }}
          />
          <img src={aragonText} />
        </Title>
        <Account id="account">
          <img src={youtubeIcon} />
          <img src={twitterIcon} />
          <img src={discordIcon} />
          <img src={messageIcon} />
        </Account>
      </Navbar>
    </HeaderWrapperDiv>
  );
};

export default Footer;
