import React from 'react';
import {
  CustomTransaction,
  CustomTransactionStatus,
  Response,
} from 'utils/types';
import { styled, useTheme } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import TransactionList from 'components/TransactionKeeper/TransactionList';
import { ANButton } from 'components/Button/ANButton';
import produce from 'immer';

//* Styled Components
const Wrapper = styled(MUICard)(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '100%',
  height: 'fit-content',
  backgroundColor: theme.custom.transactionKeeper.wrapper.background,
  boxShadow: '0px 13px 9px rgba(180, 193, 228, 0.35)',
  borderRadius: '16px',
  padding: '27px 24px 24px 24px',
}));
const Title = styled(Typography)(({ theme }) => ({
  ...theme.custom.transactionKeeper.title,
  width: '100%',
  height: 'fit-content',
  boxSizing: 'border-box',
  textAlign: 'center',
  marginBottom: '21px',
}));

const TransactionMessagesCard = styled(MUICard)(({ theme }) => ({
  ...theme.custom.transactionKeeper.transactionMessagesCard,
  padding: '16px',
  marginBottom: '16px',
}));
const BoldText = styled(Typography)(({ theme }) => ({
  ...theme.custom.transactionKeeper.transactionMessagesCard.boldText,
}));
const MessageText = styled(Typography)(({ theme }) => ({
  ...theme.custom.transactionKeeper.transactionMessagesCard.text,
}));
const TransactionStatusWrapper = styled('div')({
  boxSizing: 'border-box',
  height: 'fit-content',
  width: '100%',
  marginBottom: '30px',
});
const CloseButton = styled('img')({
  height: '18px',
  width: '18px',
});
//* End of Styled Components

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
}

const TransactionKeeper: React.FC<TransactionKeeperProps> = ({
  transactionList,
  onTransactionFailure,
  onTransactionSuccess,
  onCompleteAllTransactions,
  ...props
}) => {
  const theme = useTheme();

  const [
    isProcessingTransactions,
    updateIsProcessingTransactions,
  ] = React.useState<boolean>(false);
  const [transactions, updateTransactions] = React.useState<
    CustomTransaction[]
  >([...transactionList]);

  const updateTransaction = (
    updatedTransaction: CustomTransaction,
    updatedTransactionIndex: number,
  ) => {
    console.log('updating transaction' + updatedTransactionIndex);
    const updatedTransactions = transactions.map((transaction, index) =>
      index === updatedTransactionIndex ? updatedTransaction : transaction,
    );
    updateTransactions([...updatedTransactions]);
  };

  const executeTransactions = React.useCallback(async () => {
    console.log('Executing transactions');
    updateIsProcessingTransactions(true);
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
        // TODO add a condition to check if we need to stop executing transacctions based on a transaction level propoerty. This propeorty if needed is to be added to CustomTransactions type. CustomTransaction.abortQueueOnFailure = true/false
        isQueueAborted = true;
        updateTransaction(updatedTransaction, index);
        onTransactionFailure(ex.error.message, updatedTransaction);
      }
      index++;
    }
    if (!isQueueAborted) {
      updateIsProcessingTransactions(false);
    }
  }, [transactionList]);
  return (
    <Wrapper>
      {isProcessingTransactions ? (
        <>
          <Title>Confirm Transactions</Title>
          <TransactionStatusWrapper>
            <TransactionList transactions={transactions}></TransactionList>
          </TransactionStatusWrapper>
          <ANButton
            buttonType="primary"
            disabled
            label="Please do not close this window until it finishes"
            width="100%"
            height="55px"
            onClick={executeTransactions}
          />
        </>
      ) : (
        <>
          <Title>Processing transactions</Title>
          <TransactionMessagesCard>
            <BoldText>Transactions to be triggered</BoldText>
            <ul>
              {transactions.map((tx) => {
                return (
                  <li key={tx.message?.slice(0, 20)}>
                    <MessageText>{tx.message}</MessageText>
                  </li>
                );
              })}
            </ul>
          </TransactionMessagesCard>
          <ANButton
            buttonType="primary"
            label="Get Started"
            width="100%"
            height="45px"
            onClick={executeTransactions}
          />
        </>
      )}
    </Wrapper>
  );
};

export default React.memo(TransactionKeeper);
