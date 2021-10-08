import React, { useState, useEffect } from 'react';
import governIcon from 'images/svgs/aragon-icon.svg';
import Wallet from 'components/Wallet/Wallet';
import { useHistory } from 'react-router-dom';
import { Button, IconCirclePlus, useLayout, GU, Tag, DropDown } from '@aragon/ui';
import styled from 'styled-components';
import { networkEnvironment } from 'environment';
import { trackEvent, EventType } from 'services/analytics';

const NavBar = styled.nav`
  display: flex;
  flex-direction: row:
  gap: ${2 * GU}px;
  padding: 8px;
  align-items: center;
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
  align-items: center;
  gap: ${GU}px;
  justify-content: flex-end;
`;

// TODO: Temporary and to be removed.
const chainInfo = {
  names: ['Mainnet', 'Rinkeby'],
  networkIds: [1, 4],
  values: ['govern', 'govern-rinkeby'],
};

const Header = () => {
  const { layoutName } = useLayout();
  const history = useHistory();
  const { networkName, chainId } = networkEnvironment;
  const [selectedNetwork, setSelectedNetwork] = useState(-1);

  useEffect(() => {
    const index = chainInfo.networkIds.indexOf(chainId);
    setSelectedNetwork(index);
  }, [chainId]);

  const redirectToHomePage = () => {
    history.push('/');
  };

  const goToCreateDaoPage = () => {
    // analytics
    trackEvent(EventType.NAVBAR_CREATEDAO_CLICKED, { network: networkName });

    history.push('/create-dao');
  };

  return (
    <NavBar id="header">
      <Title id="navbar_title" onClick={redirectToHomePage}>
        <img src={governIcon} width={layoutName !== 'small' ? '182px' : '162px'} />
        {layoutName !== 'small' && (
          <Tag mode="activity" size="normal" uppercase={false} label="Beta" />
        )}
      </Title>

      <RigtSideContainer id="account">
        {/* {layoutName !== 'small' && (
          // TODO: Temporary and to be returned.
          // <StyledText name="body2">Network:{networkName.toUpperCase()}</StyledText>          
        )} */}

        {/* // TODO: Temporary and to be removed. */}

        <DropDown
          header={'Network'}
          items={chainInfo.names}
          placeholder="Select Network"
          selected={selectedNetwork}
          onChange={(index: number) => {
            if (index !== selectedNetwork) {
              const open = window.open(undefined, '_self');
              if (open) {
                open.opener = null;
                open.location.href = `https://${chainInfo.values[index]}.aragon.org`;
              }
            }
          }}
          shadow
          iconOnly={layoutName === 'small'}
          css={`
            height: 40px;
          `}
        />

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
