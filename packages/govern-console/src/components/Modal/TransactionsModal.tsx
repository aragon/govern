import React, { useContext, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TransactionKeeper from 'components/TransactionKeeper/TransactionKeeper';
import { ModalsContext, closeTransactionsModalAction } from 'containers/HomePage/ModalsContext';

const TransactionsModal: React.FC = () => {
  const {
    state: {
      transactionsModal: {
        open,
        params: {
          onTransactionSuccess,
          transactionList,
          onTransactionFailure,
          onCompleteAllTransactions,
        },
      },
    },
    dispatch,
  } = useContext(ModalsContext);

  const handleClose = useCallback(() => {
    dispatch(closeTransactionsModalAction);
  }, [dispatch]);

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="transactions-dialog-title"
        open={open}
        maxWidth="sm"
        disableBackdropClick
      >
        <TransactionKeeper
          transactionList={transactionList}
          onTransactionFailure={onTransactionFailure}
          onTransactionSuccess={onTransactionSuccess}
          onCompleteAllTransactions={onCompleteAllTransactions}
          closeModal={handleClose}
        />
      </Dialog>
    </>
  );
};

export default TransactionsModal;
