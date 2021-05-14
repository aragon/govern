import React, { useContext, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { styled } from '@material-ui/core/styles';
import TransactionKeeper from 'components/TransactionKeeper/TransactionKeeper';
import Paper from '@material-ui/core/Paper';
import {
  ModalsContext,
  closeTransactionsModalAction,
} from 'containers/HomePage/ModalsContext';
const TransactionsDialog = styled(Dialog)({
  // width: '446px',
  // height: '294px',
  boxShadow: '0px 13px 9px rgba(180, 193, 228, 0.35)',
  borderRadius: '16px',
});

const StyledModalPaper = styled(Paper)({
  height: 'fit-content',
  width: 'fit-content',
  minwidth: '446px',
  minheight: '294px',
  background: '#ffffff',
});

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
          redirect,
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
      <TransactionsDialog
        onClose={handleClose}
        aria-labelledby="transactions-dialog-title"
        open={open}
        maxWidth="sm"
        PaperComponent={StyledModalPaper}
      >
        <TransactionKeeper
          transactionList={transactionList}
          onTransactionFailure={onTransactionFailure}
          onTransactionSuccess={onTransactionSuccess}
          onCompleteAllTransactions={onCompleteAllTransactions}
          closeModal={handleClose}
          redirect={redirect}
        />
      </TransactionsDialog>
    </>
  );
};

export default TransactionsModal;
