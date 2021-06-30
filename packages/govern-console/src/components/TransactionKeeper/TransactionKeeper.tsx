import React from 'react';
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';
import produce from 'immer';
import TransactionDialog from 'components/Dialog/TransactionDialog';
import FailureDialog from 'components/Dialog/FailureDialog';
import { getErrorFromException } from 'utils/HelperFunctions';

enum TransactionKeeperState {
  Initial,
  Processing,
  Success,
  Failure,
}

export interface TransactionKeeperProps {
  transactionList: CustomTransaction[];
  onTransactionFailure?: (errorMessage: string, transaction: CustomTransaction) => void;
  onTransactionSuccess?: (updatedTransaction: CustomTransaction, transactionReceipt: any) => void;
  onCompleteAllTransactions?: (transactions: CustomTransaction[]) => void;
  closeModal: () => void;
}

const TransactionKeeper: React.FC<TransactionKeeperProps> = ({
  transactionList,
  onTransactionFailure,
  onTransactionSuccess,
  onCompleteAllTransactions,
  closeModal,
}) => {
  const [state, setState] = React.useState(TransactionKeeperState.Initial);
  const [transactions, updateTransactions] = React.useState<CustomTransaction[]>([
    ...transactionList,
  ]);
  const [errorMessage, setErrorMessage] = React.useState('');

  const updateTransaction = React.useCallback(
    (updatedTransaction: CustomTransaction, updatedTransactionIndex: number) => {
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
        if (typeof onTransactionSuccess === 'function') {
          onTransactionSuccess(updatedTransaction, transactionReceipt);
        }
      } catch (ex) {
        const updatedTransaction = produce(transaction, (draft) => {
          draft.status = CustomTransactionStatus.Failed;
        });
        // TODO add a condition to check if we need to stop executing transactions based on a transaction level propoerty. This propeorty if needed is to be added to CustomTransactions type. CustomTransaction.abortQueueOnFailure = true/false
        isQueueAborted = true;
        updateTransaction(updatedTransaction, index);
        setState(TransactionKeeperState.Failure);
        const message = getErrorFromException(ex);
        if (typeof onTransactionFailure === 'function') {
          onTransactionFailure(message, updatedTransaction);
        }
        setErrorMessage(ex.message);
      }
      index++;
    }
    if (!isQueueAborted) {
      setState(TransactionKeeperState.Success);
    }
  }, [transactions, onTransactionFailure, onTransactionSuccess, updateTransaction]);

  switch (state) {
    case TransactionKeeperState.Initial: {
      return (
        <TransactionDialog
          title={transactionList.length > 1 ? 'Confirm transactions' : 'Confirm Transaction'}
          transactions={transactions}
          onClick={executeTransactions}
          onClose={closeModal}
          buttonLabel={'Get started'}
        />
      );
    }
    case TransactionKeeperState.Processing: {
      return (
        <TransactionDialog
          title={transactionList.length > 1 ? 'Processing transactions' : 'Processing transaction'}
          info={'Please do not close this window until it finishes.'}
          transactions={transactions}
        />
      );
    }
    case TransactionKeeperState.Success: {
      return (
        <TransactionDialog
          title={transactionList.length > 1 ? 'Completed Transactions' : 'Completed Transaction'}
          transactions={transactions}
          buttonLabel={'Continue'}
          onClick={() => {
            closeModal();
            if (typeof onCompleteAllTransactions === 'function') {
              onCompleteAllTransactions(transactions);
            }
          }}
        />
      );
    }
    case TransactionKeeperState.Failure: {
      return (
        <FailureDialog
          subTitle={'An error has occurred during the signature process.'}
          onClick={closeModal}
          moreDetails={errorMessage}
        />
      );
    }
  }
};

export default React.memo(TransactionKeeper);
