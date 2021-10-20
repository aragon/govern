import React, { useState } from 'react';
import { DropDown, Button, GU, SearchInput, IconDown, Grid, GridItem, useLayout } from '@aragon/ui';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import DaoActionCard from './components/DaoActionCard/DaoActionCard';
import NoResultFound from './components/NoResultFound/NoResultFound';
import { getTitleTransaction } from 'utils/HelperFunctions';

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
  daoName: string;
};

const Container = styled.div``;

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

const CustomDropDown = styled(DropDown)`
  border: none;
  margin-right: ${3 * GU}px;
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

const DaoActionsPage: React.FC<props> = ({ fetchMore, actions, isMore, daoName }) => {
  const history = useHistory();
  const [selected, setSelected] = useState<number>(0);
  const [value, setValue] = useState<string>('');
  const actionStates = [
    'All Actions',
    'Executable',
    'Scheduled',
    'Challenged',
    'Executed',
    'Rejected',
    'Ruled Negatively',
  ];

  const FilterState = (data: actionsType[0]) => {
    return selected > 0 ? actionStates[selected] === data.state : true;
  };

  const SearchAction = (data: actionsType[0]) => {
    const formatedTitle = getTitleTransaction(data.payload.title);
    const re = new RegExp(value, 'i');
    if (formatedTitle?.match(re) || value === '') return data;
  };

  const RenderActions = (actions: actionsType) => {
    const { layoutName } = useLayout();
    const temp: React.ReactElement[] = [];
    if (actions) {
      actions
        .filter((data) => FilterState(data)) // Filter Based on status
        .filter((data) => SearchAction(data)) // search among visible Actions
        .map((data, index: number) => {
          temp.push(
            <GridItem
              key={index}
              gridColumn={layoutName === 'medium' ? '1/-1' : index % 2 === 0 ? '1/3' : '3/5'}
            >
              <DaoActionCard
                id={data.id}
                date={data.createdAt}
                state={data.state}
                title={data.payload.title}
                dao_identifier={daoName}
              />
            </GridItem>,
          );
        });
      if (temp.length === 0) return <NoResultFound type="action" />;
      return temp;
    } else return <div>Loading...</div>;
  };

  const goToNewExecution = () => {
    history.push(`/daos/${daoName}/actions/new`);
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Actions</Title>
        <CustomActionButton label="New action" onClick={goToNewExecution} />
      </HeaderContainer>
      <SearchContainer>
        <CustomDropDown items={actionStates} selected={selected} onChange={setSelected} />
        <SearchInput
          css={`
            width: 100%;
            border-radius: 12px;
          `}
          adornmentSettings={{
            width: 25,
          }}
          onChange={(text: string) => setValue(text)}
          placeholder="Type to search..."
          wide
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
