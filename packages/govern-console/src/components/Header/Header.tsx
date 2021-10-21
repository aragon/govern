import {
  Button,
  ButtonText,
  DropDown,
  GU,
  IconCirclePlus,
  IconClose,
  IconDotMenu,
  useLayout,
} from '@aragon/ui';
import { useHistory } from 'react-router-dom';
import { useCallback, useMemo, useState, useEffect } from 'react';

import Wallet from 'components/Wallet/Wallet';
import styled from 'styled-components';
import GovernIcon from 'images/svgs/aragon-icon.svg';
import { networkEnvironment } from 'environment';
import { trackEvent, EventType } from 'services/analytics';

const NavBar = styled.nav<{ flexDirection: string }>`
  padding: 16px;
  display: flex;
  align-items: center;
  // background: rgba(255, 255, 255, 0.88);
  flex-direction: ${({ flexDirection }) => flexDirection};
`;

const Title = styled.div`
  display: flex;
  width: fit-content;
  cursor: pointer;
  align-items: center;
  column-gap: ${GU}px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MenuButton = styled(ButtonText)<{ isOpen: boolean }>`
  height: 40px;
  padding: 8px 12px 8px 14px;
  border-radius: 8px;
  ${({ isOpen }) => isOpen && 'background: #f0fbff;'}

  color: #00c2ff;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;

  & > div {
    gap: ${GU}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Menu = styled.div<{ show: boolean; isSmall: boolean }>`
  ${({ show }) => !show && 'display: none;'}
  ${({ isSmall }) =>
    isSmall &&
    `width: 100%;
  position: fixed;
  top: 80px;
  bottom: 0;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  z-index: 1001;`}
`;

const MenuItems = styled.div<{ isSmall: boolean }>`
  ${({ isSmall }) =>
    isSmall &&
    `height: 100%;
  padding: 24px 16px 120px 16px;`}

  display: flex;
  flex-direction: column;
  // Uncomment when links are available
  // justify-content: space-between;
  justify-content: flex-end;
  z-index: 1000;
`;

const LinkGroup = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap}px;
  z-index: 1000;
`;

// TODO: Links are temporarily unavailable
// const NavLinkGroup = styled(LinkGroup)<{ isSmall: boolean }>`
//   ${({ isSmall }) => !isSmall && 'display: none'}
// `;

// const MenuLink = styled(Link)`
//   color: #7483ab;
//   padding: 12px 16px;
//   text-decoration: none;
// `;

const ActionLinkGroup = styled(LinkGroup)<{ isSmall: boolean }>`
  ${({ isSmall }) => !isSmall && ' flex-direction: row-reverse;'}
`;

const WalletContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${3 * GU}px;
`;

// TODO: Temporary and to be removed.
const chainInfo = {
  names: ['Mainnet', 'Rinkeby'],
  networkIds: [1, 4],
  values: ['govern', 'govern-rinkeby'],
};

const Header = () => {
  const history = useHistory();
  const { layoutName } = useLayout();
  const { networkName, chainId } = networkEnvironment;
  const [selectedNetwork, setSelectedNetwork] = useState(-1);

  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);
  const [showMenu, setShowMenu] = useState<boolean>(() => !layoutIsSmall);

  useEffect(() => {
    if (layoutIsSmall) setShowMenu(false);
    else setShowMenu(true);
  }, [layoutIsSmall]);

  useEffect(() => {
    const index = chainInfo.networkIds.indexOf(chainId);
    setSelectedNetwork(index);
  }, [chainId]);

  const redirectToHomePage = () => {
    history.push('/');
  };

  const goToCreateDaoPage = useCallback(() => {
    // analytics
    trackEvent(EventType.NAVBAR_CREATEDAO_CLICKED, { network: networkName });
    history.push('/create-dao');
  }, [history, networkName]);

  const handleDropDownChange = useCallback(
    (index: number) => {
      if (index !== selectedNetwork) {
        const open = window.open(undefined, '_self');
        if (open) {
          open.opener = null;
          open.location.href = `https://${chainInfo.values[index]}.aragon.org`;
        }
      }
    },
    [selectedNetwork],
  );

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBar id="header" flexDirection={layoutIsSmall ? 'column' : 'row'}>
      <Container>
        <Title id="navbar_title" onClick={redirectToHomePage}>
          <img src={GovernIcon} width={layoutIsSmall ? '162px' : '182px'} />
        </Title>
        {layoutIsSmall && (
          <MenuButton isOpen={showMenu} onClick={handleMenuClick}>
            <div>
              Menu
              {showMenu ? <IconClose /> : <IconDotMenu />}
            </div>
          </MenuButton>
        )}
      </Container>
      <Menu show={showMenu} isSmall={layoutIsSmall}>
        <MenuItems isSmall={layoutIsSmall}>
          {/* Currently unavailable
          <NavLinkGroup gap={GU} isSmall={layoutIsSmall}>
            <MenuLink to="/">Explore DAOs</MenuLink>
            <MenuLink to="/">Documentation</MenuLink>
          </NavLinkGroup> */}
          <ActionLinkGroup gap={3 * GU} isSmall={layoutIsSmall}>
            <Button
              size={'large'}
              label={'Create DAO'}
              onClick={goToCreateDaoPage}
              icon={!layoutIsSmall && <IconCirclePlus />}
              css={layoutIsSmall ? 'height: 46px;' : ''}
            />
            <WalletContainer>
              <DropDown
                shadow
                items={chainInfo.names}
                header={'Network'}
                selected={selectedNetwork}
                onChange={handleDropDownChange}
                placeholder="Select Network"
                css={`
                  height: ${layoutIsSmall ? '48' : '40'}px;
                `}
              />
              <Wallet buttonCSS={`height:  ${layoutIsSmall ? '48' : '40'}px; flex: 1;`} />
            </WalletContainer>
          </ActionLinkGroup>
        </MenuItems>
      </Menu>
    </NavBar>
  );
};

export default Header;
