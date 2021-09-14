import styled from 'styled-components';
import { Box, IconWallet, IconSettings, useLayout } from '@aragon/ui';

import ActionLink from '../ActionLink/ActionLink';

type Props = {
  baseUrl: string;
  identifier: string;
  openActions: string;
};

type MenuOptions = {
  path: string;
  label: string;
  icon: React.ReactElement;
};

/**
 * TODO: Get actions svg from aragon/ui
 */
const links: MenuOptions[] = [
  { path: '/actions', label: 'Actions', icon: <IconWallet /> },
  { path: '/finance', label: 'Finance', icon: <IconWallet /> },
  { path: '/settings', label: 'Settings', icon: <IconSettings /> },
];

/**
 * Interestingly enough the avatar will collapse into it if the border isn't set
 */
const Container = styled.div`
  border: 1px solid transparent;
  position: relative;
`;

const AvatarContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  padding: 0px 24px;
  z-index: 1;
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-items: center;
  border-radius: 100px;
  background-color: #f6f9fc;
  padding: 8px;
`;

/** Placeholder for actual avatar */
const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background-color: red;
`;

const Content = styled(Box)`
  margin-top: 24px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
`;

const Details = styled.div`
  gap: 4px;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

/**
 * Should probably be replaced with StyledText from aragon/ui
 */
const Title = styled.p`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: #20232c;
`;
const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #7483ab;
`;

const LinkGroup = styled.div`
  height: 168px;
  margin-top: 24px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DaoSideCard: React.FC<Props> = ({ baseUrl, identifier, openActions }) => {
  const { layoutName } = useLayout();

  return (
    <Container>
      <AvatarContainer css={layoutName === 'small' ? 'justify-content: center' : undefined}>
        <AvatarWrapper>
          <Avatar />
        </AvatarWrapper>
      </AvatarContainer>
      <Content>
        <Details css={layoutName === 'small' ? 'align-items: center' : undefined}>
          <Title>{identifier}</Title>
          <Subtitle>{openActions} open actions</Subtitle>
        </Details>
        <LinkGroup css={layoutName === 'small' ? 'flex-direction: row' : undefined}>
          {links.map(({ path, icon, label }, index) => (
            <ActionLink key={index} url={baseUrl + path} label={label} icon={icon} />
          ))}
        </LinkGroup>
      </Content>
    </Container>
  );
};

export default DaoSideCard;
