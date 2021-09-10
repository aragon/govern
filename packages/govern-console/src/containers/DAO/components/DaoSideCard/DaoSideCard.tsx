import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { IconWallet, IconSettings } from '@aragon/ui';

const Container = styled.div`
  width: 298px;
  height: 342px;
  display: flex;
  position: relative;
`;

const StyledCard = styled.div`
  width: 298px;
  height: 314px;
  align-self: flex-end;
  background-color: white;

  border-radius: 16px;
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
`;

const AvatarContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 24px;
`;

const Avatar = styled.div`
  border-radius: 50%;
  padding: 8px;
  width: 40px;
  height: 40px;
background-color: red;
  drop-shadow(0px 3px 3px rgba(180, 193, 228, 0.35));
`;

const Details = styled.div`
  margin: 40px 24px 0px 24px;
`;

const Title = styled.p`
  margin: 0;
  color: #20232c;
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  /* border: 1px dotted green; */
`;

const ActionsCount = styled.p`
  margin: 0;
  color: #7483ab;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  /* border: 1px dotted green; */
`;

const LinkGroup = styled.div`
  height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 24px;
  /* border: 1px dotted blue; */
`;

const ActionLink = styled(NavLink)`
  height: 48px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  size: 16px;
  color: #7483ab;
  line-height: 20px;
  font-weight: 600;
  text-decoration: none;

  /* Active */
  &.active {
    color: #00c2ff;
    background-color: #f0fbff;
  }
`;

type Props = {
  baseUrl: string;
  identifier: string;
  openActions: string;
};

const DaoSideCard: React.FC<Props> = ({ baseUrl, identifier, openActions }) => {
  console.log(baseUrl);
  return (
    <Container>
      <StyledCard>
        <AvatarContainer>
          <Avatar />
        </AvatarContainer>
        <Details>
          <Title>{identifier}</Title>
          <ActionsCount>{openActions} open actions</ActionsCount>
        </Details>
        <LinkGroup>
          <ActionLink to={`${baseUrl}/actions`}>
            <IconWallet css={{ margin: '12px' }} />
            Actions
          </ActionLink>
          <ActionLink to={`${baseUrl}/finance`}>
            <IconWallet css={{ margin: '12px' }} />
            Finance
          </ActionLink>
          <ActionLink to={`${baseUrl}/settings`}>
            <IconSettings css={{ margin: '12px' }} />
            Settings
          </ActionLink>
        </LinkGroup>
      </StyledCard>
    </Container>
  );
};

export default DaoSideCard;
