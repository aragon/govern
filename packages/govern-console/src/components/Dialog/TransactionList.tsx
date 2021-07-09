import React from 'react';
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';
import { CircularProgressStatus } from 'utils/types';
import { GU, RADII } from '@aragon/ui';
import styled from 'styled-components';

export interface TransactionListProps {
  transactions: CustomTransaction[];
}

const Container = styled.div`
  background: #f6f9fc;
  padding: ${2 * GU}px;
  border-radius: ${RADII['small']}px;
  margin: auto;
  width: 100%;
`;

const TransactionListWrapper = styled.ul`
  padding-inline-start: 0;
  list-style: none;
`;

const TransactionListItem = styled.li`
  padding: 0;
`;

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getListItem = (transaction: CustomTransaction) => {
    switch (transaction.status) {
      case CustomTransactionStatus.Pending:
        return (
          <ANCircularProgressWithCaption
            caption={transaction.message} // TODO: pending
            state={CircularProgressStatus.Disabled}
          />
        );
      case CustomTransactionStatus.InProgress:
        return (
          <ANCircularProgressWithCaption
            caption={transaction.message} // TODO: in progress
            state={CircularProgressStatus.InProgress}
          />
        );
      case CustomTransactionStatus.Successful:
        return (
          <ANCircularProgressWithCaption
            caption={transaction.message} // TODO: successfull
            state={CircularProgressStatus.Done}
          />
        );
      case CustomTransactionStatus.Failed:
        return (
          <ANCircularProgressWithCaption
            caption={transaction.message} // TODO: failed
            state={CircularProgressStatus.Failed}
          />
        );
    }
  };
  return (
    <Container>
      <TransactionListWrapper>
        {transactions.map((transaction) => {
          return (
            <TransactionListItem key={transaction.message}>
              {getListItem(transaction)}
            </TransactionListItem>
          );
        })}
      </TransactionListWrapper>
    </Container>
  );
};

export default React.memo(TransactionList);
