import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useLayout } from '@aragon/ui';

/**
 * TODO: min-width for small screen
 * Also, on small screen the square tapped area despite
 * border-radius
 */
const StyledDiv = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 8px 12px;
  border-radius: 12px;

  font-size: 16px;
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

export type ActionLinkProps = {
  url: string;
  label: string;
  icon: React.ReactElement;
};

const ActionLink: React.FC<ActionLinkProps> = ({ url, label, icon }) => {
  const { layoutName } = useLayout();

  return (
    <StyledDiv
      to={url}
      css={layoutName === 'small' ? 'justify-content: center; flex: 1' : undefined}
    >
      {layoutName !== 'small' && icon}
      {label}
    </StyledDiv>
  );
};

export default ActionLink;
