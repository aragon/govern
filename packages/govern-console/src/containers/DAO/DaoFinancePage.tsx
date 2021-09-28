import React, { useState } from 'react';
import { Button, GU, useLayout, IconDown } from '@aragon/ui';
import styled from 'styled-components';
import DaoTransactionCard from './components/DaoTransactionCard/DaoTransactionCard';
import DaoTransferModal from './DaoTransferModal';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 28px;
  line-height: 125%;
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

const TransactionListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const ListTitle = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 125%;
  margin-bottom: 16px;
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

const DaoFinancePage: React.FC = () => {
  const { layoutName } = useLayout();
  const [opened, setOpened] = useState<boolean>(false);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  return (
    <div>
      <HeaderContainer>
        <Title>Finance</Title>
        <CustomActionButton label="New Transfer" onClick={open} />
      </HeaderContainer>
      <TransactionListContainer>
        <ListTitle>Transactions</ListTitle>
        <DaoTransactionCard />
      </TransactionListContainer>
      <LoadMoreButton>
        <span>Load more</span>
        <IconDown />
      </LoadMoreButton>
      <DaoTransferModal opened={opened} close={close} />
    </div>
  );
};

export default DaoFinancePage;
