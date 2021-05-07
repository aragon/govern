import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import governIcon from 'images/aragon-icon.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';
import { ANButton } from 'components/Button/ANButton';

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
          <img src={governIcon} width="210px" />
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
