import { useState } from 'react';
import { DropDown, Button, GU, SearchInput } from '@aragon/ui';
import styled from 'styled-components';

import ActionsList from './components/ActionsList/ActionsList';

const Container = styled.div`
  margin-top: ${3 * GU}px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 28px;
  line-height: 125%;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const CustomButton = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  width: 134px;
  height: 44px;
  border-radius: 12px;
  box-shadow: none;
`;

const ActionListContainer = styled.div`
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const DaoActionsPage: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <Container>
      <HeaderContainer>
        <Title>Actions</Title>
        <CustomButton label="New action" />
      </HeaderContainer>
      <SearchContainer>
        <DropDown
          items={['All Actions', 'Black Wildflower', 'Ancient Paper']}
          css={`
            border: none;
          `}
          selected={selected}
          onChange={setSelected}
        />
        <SearchInput
          css={`
            width: 100%;
            margin-left: ${3 * GU}px;
            border-radius: 12px;
          `}
          placeholder="Type to search..."
          wide={true}
        />
      </SearchContainer>
      <ActionListContainer>
        <ActionsList />
      </ActionListContainer>
    </Container>
  );
};

export default DaoActionsPage;
