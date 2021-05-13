/* eslint-disable */
import { styled } from '@material-ui/core/styles';
import AragonIcon from 'images/aragon-graphic-only-icon.svg';
import aragonText from 'images/svgs/Aragon.svg';
import discordIcon from 'images/svgs/discord.svg';
import messageIcon from 'images/svgs/message.svg';
import twitterIcon from 'images/svgs/twitter.svg';
import telegramIcon from 'images/svgs/telegrama.svg';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const FooterWrapperDiv = styled('div')({
  width: 'auto',
  height: '60px',
  marginTop: '30px',
  // background: '#FFFFFF'
});

const Logo = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: 'fit-content',
  cursor: 'pointer',
  marginLeft: '50px',
});
const Social = styled('div')({
  display: 'flex',
  width: 'auto',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginRight: '50px',
});

const Footer = ({}) => {
  const history = useHistory();

  const redirectToHomePage = () => {
    history.push('/');
  };

  return (
    <FooterWrapperDiv>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Logo onClick={redirectToHomePage}>
            <img src={AragonIcon} style={{ height: '31px', width: '35px' }} />
            <img src={aragonText} />
          </Logo>
        </Grid>
        <Grid item xs={12} sm={6} key="social">
          <Social>
            <a
              href={'https://twitter.com/AragonProject'}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={twitterIcon} />
            </a>
            <a
              style={{ marginLeft: '28px' }}
              href={'https://discord.com/invite/eqQJkdp'}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={discordIcon} />
            </a>
            <a
              style={{ marginLeft: '28px' }}
              href={'https://t.me/AragonProject'}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                style={{ width: '25px', height: '25px' }}
                src={telegramIcon}
              />
            </a>
            <a
              style={{ marginLeft: '28px' }}
              href={'https://forum.aragon.org/'}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={messageIcon} />
            </a>
          </Social>
        </Grid>
      </Grid>
    </FooterWrapperDiv>
  );
};

export default Footer;
