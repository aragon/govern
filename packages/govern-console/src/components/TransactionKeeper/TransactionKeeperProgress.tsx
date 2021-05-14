import React from 'react';
import {
  TransactionKeeperTitle,
  TransactionKeeperWrapper,
  TransactionStatusWrapper,
} from './TransactionKeeperStyles';
import TransactionList, {
  TransactionListProps,
} from 'components/TransactionKeeper/TransactionList';
import { ANButton } from 'components/Button/ANButton';

const TransactionKeeperProgress: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  return (
    <TransactionKeeperWrapper>
      <TransactionKeeperTitle>Confirm Transactions</TransactionKeeperTitle>
      <TransactionStatusWrapper>
        <TransactionList transactions={transactions}></TransactionList>
      </TransactionStatusWrapper>
      <ANButton
        buttonType="primary"
        disabled
        label="Please do not close this window until it finishes"
        width="100%"
        height="55px"
        onClick={() => {
          /* do nothing */
        }}
      />
    </TransactionKeeperWrapper>
  );
};

export default React.memo(TransactionKeeperProgress);
