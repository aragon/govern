import React from 'react';
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';
import produce from 'immer';
import TransactionKeeperInitial from './TransactionKeeperInitial';
import TransactionKeeperProgress from './TransactionKeeperProgress';
import TransactionKeeperSuccess from './TransactionKeeperSuccess';
import TransactionKeeperFailure from './TransactionKeeperFailure';

enum TransactionKeeperState {
  Initial,
  Processing,
  Success,
  Failure,
}

const getErrorFromException = (ex: any): string => {
  let errorMessage = ex.error?.message || ex.message;
  if (!errorMessage) {
    try {
      errorMessage = JSON.stringify(ex);
    } catch {
      errorMessage = 'Unknown error';
    }
  }
  return errorMessage;
};

export interface TransactionKeeperProps {
  transactionList: CustomTransaction[];
  onTransactionFailure: (
    errorMessage: string,
    transaction: CustomTransaction,
  ) => void;
  onTransactionSuccess: (
    updatedTransaction: CustomTransaction,
    transactionReceipt: any,
  ) => void;
  onCompleteAllTransactions: (transactions: CustomTransaction[]) => void;
  closeModal: () => void;
  redirect?: () => void;
}

const TransactionKeeper: React.FC<TransactionKeeperProps> = ({
  transactionList,
  onTransactionFailure,
  onTransactionSuccess,
  onCompleteAllTransactions,
  closeModal,
  redirect,
}) => {
  const [state, setState] = React.useState(TransactionKeeperState.Initial);
  const [transactions, updateTransactions] = React.useState<
    CustomTransaction[]
  >([...transactionList]);

  const updateTransaction = React.useCallback(
    (
      updatedTransaction: CustomTransaction,
      updatedTransactionIndex: number,
    ) => {
      console.log('updating transaction' + updatedTransactionIndex);
      const updatedTransactions = transactions.map((transaction, index) =>
        index === updatedTransactionIndex ? updatedTransaction : transaction,
      );
      updateTransactions([...updatedTransactions]);
    },
    [transactions],
  );

  const executeTransactions = React.useCallback(async () => {
    console.log('Executing transactions');
    setState(TransactionKeeperState.Processing);
    let index = 0;
    let isQueueAborted = false;
    for (const transaction of transactions) {
      if (isQueueAborted) return;
      try {
        let updatedTransaction = produce(transaction, (draft) => {
          draft.status = CustomTransactionStatus.InProgress;
        });
        updateTransaction(updatedTransaction, index);
        const transactionResponse: any = await transaction.tx();
        const transactionReceipt = await transactionResponse.wait();
        updatedTransaction = produce(transaction, (draft) => {
          draft.status = CustomTransactionStatus.Successful;
        });
        updateTransaction(updatedTransaction, index);
        onTransactionSuccess(updatedTransaction, transactionReceipt);
      } catch (ex) {
        const updatedTransaction = produce(transaction, (draft) => {
          draft.status = CustomTransactionStatus.Failed;
        });
        // TODO add a condition to check if we need to stop executing transactions based on a transaction level propoerty. This propeorty if needed is to be added to CustomTransactions type. CustomTransaction.abortQueueOnFailure = true/false
        isQueueAborted = true;
        updateTransaction(updatedTransaction, index);
        setState(TransactionKeeperState.Failure);
        const errorMessage = getErrorFromException(ex);
        onTransactionFailure(errorMessage, updatedTransaction);
      }
      index++;
    }
    if (!isQueueAborted) {
      setState(TransactionKeeperState.Success);
      onCompleteAllTransactions(transactions);
    }
  }, [
    transactions,
    onTransactionFailure,
    onTransactionSuccess,
    onCompleteAllTransactions,
    updateTransaction,
  ]);

  switch (state) {
    case TransactionKeeperState.Initial: {
      return (
        <TransactionKeeperInitial
          transactions={transactions}
          onClick={executeTransactions}
        ></TransactionKeeperInitial>
      );
    }
    case TransactionKeeperState.Processing: {
      return (
        <TransactionKeeperProgress
          transactions={transactions}
        ></TransactionKeeperProgress>
      );
    }
    case TransactionKeeperState.Success: {
      return (
        <TransactionKeeperSuccess
          onClick={() => {
            closeModal();
            if (redirect) {
              redirect();
            }
          }}
        ></TransactionKeeperSuccess>
      );
    }
    case TransactionKeeperState.Failure: {
      return (
        <TransactionKeeperFailure
          transactions={transactions}
          onClick={closeModal}
        ></TransactionKeeperFailure>
      );
    }
  }
};

export default React.memo(TransactionKeeper);
