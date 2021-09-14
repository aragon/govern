import { useState } from 'react';
import { DropDown, Button, GU, SearchInput, IconSearch, Grid, GridItem } from '@aragon/ui';
import styled from 'styled-components';

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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const DaoActionsPage: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <Container>
      <HeaderContainer>
        <p
          css={`
            font-weight: 600;
            font-size: 28px;
            line-height: 125%;
          `}
        >
          Actions
        </p>
        <Button
          css={`
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 12px 24px;
            width: 134px;
            height: 44px;
          `}
          label="New action"
        />
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
          `}
          wide={true}
        />
      </SearchContainer>
    </Container>
  );
};

export default DaoActionsPage;
