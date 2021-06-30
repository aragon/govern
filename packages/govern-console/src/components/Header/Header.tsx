import { styled } from '@material-ui/core/styles';
import governIcon from 'images/aragon-icon.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';
import { Button, StyledText } from '@aragon/ui';

import { networkEnvironment } from 'environment';

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

const Header = () => {
  const history = useHistory();
  const { networkName } = networkEnvironment;

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
          <StyledText name="body1">Network:{networkName.toUpperCase()}</StyledText>
          <Wallet />
          <Button
            size={'large'}
            onClick={goToCreateDaoPage}
            label={'Create DAO'}
            disabled={status === 'connecting'}
          />
        </RigtSideContainer>
      </Navbar>
    </HeaderWrapperDiv>
  );
};

export default Header;
