import { styled } from '@material-ui/core/styles';
import governIcon from 'images/aragon-icon.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';
// import { ANButton } from 'components/Button/ANButton';
// import { Label } from '../Labels/Label';
import { useWallet } from '../../AugmentedWallet';
import { Button, IconStar, IconStarFilled, Tag, useTheme } from '@aragon/ui';

const HeaderWrapperDiv = styled('div')({
  height: '106px',
  width: '100%',
  display: 'block',
  top: 0,
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

const RigtSideContainer = styled('div')({
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '10px',
});

const Header = ({ ...props }) => {
  const theme = useTheme();
  const history = useHistory();
  const context: any = useWallet();
  const { networkName } = context;

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
          <img src={governIcon} width="210px" />
        </Title>
        <RigtSideContainer id="account">
          <Button
            onClick={props.toggleTheme}
            icon={props.themeMode === 'light' ? <IconStar /> : <IconStarFilled />}
          />
          <Tag
            label={`${networkName} network`}
            color={theme.primaryContent}
            background={theme.primary}
          />
          <Wallet />
          <Button
            size={'large'}
            onClick={goToCreateDaoPage}
            label={'Create DAO'}
            height={'48px'}
            width={'174px'}
            disabled={status === 'connecting'}
          />
        </RigtSideContainer>
      </Navbar>
    </HeaderWrapperDiv>
  );
};

export default Header;
