import governIcon from 'images/svgs/aragon-icon.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';
import { Button, StyledText, IconCirclePlus, useLayout, GU, Tag } from '@aragon/ui';
import styled from 'styled-components';
import { networkEnvironment } from 'environment';

const NavBar = styled.nav`
  display: flex;
  flex-direction: row:
  gap: 16px;
  padding: 8px;
`;

const Title = styled.div`
  display: flex;
  width: fit-content;
  cursor: pointer;
  align-items: center;
  column-gap: ${GU}px;
`;

const RigtSideContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const Header = () => {
  const { layoutName } = useLayout();
  const history = useHistory();
  const { networkName } = networkEnvironment;

  const redirectToHomePage = () => {
    history.push('/');
  };

  const goToCreateDaoPage = () => {
    history.push('/create-dao');
  };

  return (
    <NavBar id="header">
      <Title id="navbar_title" onClick={redirectToHomePage}>
        <img src={governIcon} width={layoutName !== 'small' ? '182px' : '162px'} />
        <Tag mode="activity" size="normal" uppercase={false} label="Beta" />
      </Title>
      <RigtSideContainer id="account">
        {layoutName !== 'small' && (
          <StyledText name="body2">Network:{networkName.toUpperCase()}</StyledText>
        )}
        <Wallet />
        <Button
          size={'large'}
          onClick={goToCreateDaoPage}
          label={'Create DAO'}
          icon={<IconCirclePlus />}
          display={layoutName === 'small' ? 'icon' : 'label'}
          disabled={status === 'connecting'}
        />
      </RigtSideContainer>
    </NavBar>
  );
};

export default Header;
