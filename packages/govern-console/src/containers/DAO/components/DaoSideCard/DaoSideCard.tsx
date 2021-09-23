import {
  Box,
  EthIdenticon,
  IconActionsFilled,
  IconSettingsFilled,
  IconFinanceFilled,
  useLayout,
} from '@aragon/ui';
import styled from 'styled-components';
import { useMemo } from 'react';

import ActionLink from '../ActionLink/ActionLink';

type Props = {
  address: string;
  baseUrl: string;
  identifier: string;
  openActions: string;
};

type MenuOptions = {
  path: string;
  label: string;
  icon: React.ReactElement;
};

const links: MenuOptions[] = [
  { path: '/actions', label: 'Actions', icon: <IconActionsFilled size="small" /> },
  { path: '/finance', label: 'Finance', icon: <IconFinanceFilled size="small" /> },
  { path: '/settings', label: 'Settings', icon: <IconSettingsFilled size="small" /> },
];

const Container = styled.div`
  border: 1px solid transparent;
  position: relative;
`;

const AvatarContainer = styled.div<{ justify: string }>`
  position: absolute;
  width: 100%;
  display: flex;
  padding: 0px 24px;
  z-index: 1;
  justify-content: ${({ justify }) => justify};
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-items: center;
  border-radius: 100px;
  background-color: #f6f9fc;
  padding: 8px;
`;

const Content = styled(Box)`
  margin-top: 24px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
`;

const Details = styled.div<{ align: string }>`
  gap: 4px;
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align};
  margin-top: 16px;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: #20232c;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #7483ab;
`;

const LinkGroup = styled.div<{ layoutIsSmall: boolean }>`
  margin-top: 24px;
  gap: 12px;
  display: flex;
  justify-content: space-between;

  ${({ layoutIsSmall }) =>
    layoutIsSmall ? 'flex-direction: row; height: auto' : 'flex-direction: column; height: 168px;'};
`;

const DaoSideCard: React.FC<Props> = ({ address, baseUrl, identifier, openActions }) => {
  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  return (
    <Container>
      <AvatarContainer justify={layoutIsSmall ? 'center' : 'flex-start'}>
        <AvatarWrapper>
          <EthIdenticon address={address} scale={2} />
        </AvatarWrapper>
      </AvatarContainer>
      <Content>
        <Details align={layoutIsSmall ? 'center' : 'flex-start'}>
          <Title>{identifier}</Title>
          <Subtitle>{openActions} open actions</Subtitle>
        </Details>
        <LinkGroup layoutIsSmall={layoutIsSmall}>
          {links.map(({ path, icon, label }, index) => (
            <ActionLink key={index} url={baseUrl + path} label={label} icon={icon} />
          ))}
        </LinkGroup>
      </Content>
    </Container>
  );
};

export default DaoSideCard;
