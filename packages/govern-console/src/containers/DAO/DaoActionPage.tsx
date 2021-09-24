import React, { useState } from 'react';
import { DropDown, Button, GU, SearchInput, IconDown, Grid, GridItem, useLayout } from '@aragon/ui';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import DaoActionCard from './components/DaoActionCard/DaoActionCard';

type actionsType = {
  __typename?: string;
  id: string;
  state: string;
  createdAt: string;
  payload: {
    __typename?: string;
    id: string;
    executionTime: string;
    title: string;
  };
}[];

type props = {
  fetchMore: () => Promise<void>;
  actions: actionsType;
  isMore: boolean;
  identifier: string;
};

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

const CustomActionButton = styled(Button)`
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

const LoadMoreButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  width: 154px;
  height: 44px;
  border-radius: 12px;
  color: #7483ab;
  background: #ffffff;
  box-shadow: none;
  cursor: pointer;
  & > svg {
    padding-left: 2px;
  }
`;

const ActionListContainer = styled.div`
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const NoAvailableActionContainer = styled.strong`
  text-align: center;
`;

const DaoActionsPage: React.FC<props> = ({ fetchMore, actions, isMore, identifier }) => {
  const history = useHistory();
  const [selected, setSelected] = useState<number>(0);
  const [value, setValue] = useState<string>('');

  const FilterState = (data: actionsType[0]) => {
    enum Filters { // Convern DropDown Number to Status
      Executable = 1,
      Scheduled = 2,
      Challenged = 3,
      Executed = 4,
      Ruled_Negatively = 5,
    }
    switch (selected) {
      case Filters.Executable:
        return data.state === 'Executable';
      case Filters.Scheduled:
        return data.state === 'Scheduled';
      case Filters.Challenged:
        return data.state === 'Challenged';
      case Filters.Executed:
        return data.state === 'Executed';
      case Filters.Ruled_Negatively:
        return data.state === 'Ruled Negatively';
      default:
        return data;
    }
  };

  const SearchAction = (data: actionsType[0]) => {
    const re = new RegExp(value, 'i');
    if (data.payload.title?.match(re) || value === '') return data;
  };

  const RenderActions = (actions: actionsType) => {
    const { layoutName } = useLayout();
    const temp: React.ReactElement[] = [];
    if (actions) {
      actions
        .filter((data) => FilterState(data)) // Filter Based on status
        .filter((data) => SearchAction(data)) // search among vidible Actions
        .map((data, index: number) => {
          temp.push(
            <GridItem
              gridColumn={layoutName === 'medium' ? '1/-1' : index % 2 === 0 ? '1/3' : '3/5'}
            >
              <DaoActionCard
                key={index}
                date={data.createdAt}
                state={data.state}
                title={data.payload.title}
              />
            </GridItem>,
          );
        });
      if (temp.length === 0)
        return <NoAvailableActionContainer>No action available!</NoAvailableActionContainer>;
      return temp;
    } else return <div>Loading...</div>;
  };

  const goToNewExecution = () => {
    history.push(`/daos/${identifier}/actions/new-execution`);
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Actions</Title>
        <CustomActionButton label="New action" onClick={goToNewExecution} />
      </HeaderContainer>
      <SearchContainer>
        <DropDown
          items={[
            'All Actions',
            'Executable',
            'Scheduled',
            'Challenged',
            'Executed',
            'Ruled Negatively',
          ]}
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
          onChange={(text: string) => setValue(text)}
          placeholder="Type to search..."
          wide={true}
        />
      </SearchContainer>
      <ActionListContainer>
        <Grid column={'4'}>{RenderActions(actions)}</Grid>
      </ActionListContainer>
      {isMore && (
        <LoadMoreButton onClick={fetchMore}>
          <span>Load more</span>
          <IconDown />
        </LoadMoreButton>
      )}
    </Container>
  );
};

export default DaoActionsPage;