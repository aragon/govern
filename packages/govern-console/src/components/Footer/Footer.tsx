import { styled } from '@material-ui/core/styles';
import AragonIcon from 'images/aragon-graphic-only-icon.svg';
import aragonText from 'images/svgs/Aragon.svg';
import discordIcon from 'images/svgs/discord.svg';
import messageIcon from 'images/svgs/message.svg';
import twitterIcon from 'images/svgs/twitter.svg';
import telegramIcon from 'images/svgs/telegrama.svg';
import { useHistory } from 'react-router-dom';
import { Grid, GridItem, useLayout } from '@aragon/ui';

const Logo = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: 'fit-content',
  cursor: 'pointer',
});
const Social = styled('div')({
  display: 'flex',
  width: 'auto',
  flexDirection: 'row',
  justifyContent: 'flex-end',
});

const Footer = ({}) => {
  const history = useHistory();
  const { layoutName } = useLayout();
  const redirectToHomePage = () => {
    history.push('/');
  };

  return (
    <Grid style={{ marginTop: 24 }}>
      <GridItem
        gridRow={'1'}
        gridColumn={'1/2'}
        alignHorizontal={layoutName === 'small' ? 'center' : 'flex-start'}
      >
        <Logo onClick={redirectToHomePage}>
          <img src={AragonIcon} style={{ height: '31px', width: '35px' }} />
          <img src={aragonText} />
        </Logo>
      </GridItem>
      <GridItem
        gridRow={'1'}
        gridColumn={'2/3'}
        alignHorizontal={layoutName === 'small' ? 'center' : 'flex-end'}
      >
        <Social>
          <a href={'https://twitter.com/AragonProject'} target="_blank" rel="noreferrer noopener">
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
            <img style={{ width: '25px', height: '25px' }} src={telegramIcon} />
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
      </GridItem>
    </Grid>
  );
};

export default Footer;
