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
const TransactionListWrapper = styled('ul')(({ theme }) => ({
  paddingInlineStart: '30px',
}));
const TransactionListItem = styled('li')(({ theme }) => ({
  padding: 0,
}));
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
  closeModal: () => void;
}

const TransactionKeeper: React.FC<TransactionKeeperProps> = ({
  transactionList,
  onTransactionFailure,
  onTransactionSuccess,
  onCompleteAllTransactions,
  closeModal,
  ...props
}) => {
  const [
    isProcessingTransactions,
    updateIsProcessingTransactions,
  ] = React.useState<boolean>(false);
  const [
    isFinishedExecutingTransactions,
    updateIsFinishedExecutingTransactions,
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
        // TODO add a condition to check if we need to stop executing transactions based on a transaction level propoerty. This propeorty if needed is to be added to CustomTransactions type. CustomTransaction.abortQueueOnFailure = true/false
        isQueueAborted = true;
        updateTransaction(updatedTransaction, index);
        // TODO proper error handling will be done in https://linear.app/aragon/issue/DAO-278
        // for now just make this line not crash the site because ex.error sometimes is undefined
        onTransactionFailure(
          ex.error?.message || ex.message,
          updatedTransaction,
        );
      }
      index++;
    }
    if (!isQueueAborted) {
      updateIsFinishedExecutingTransactions(true);
      onCompleteAllTransactions(transactions);
      updateIsProcessingTransactions(false);
    } else {
      updateIsFinishedExecutingTransactions(true);
      updateIsProcessingTransactions(false);
    }
  }, [transactionList]);
  return (
    <Wrapper>
      {isProcessingTransactions || isFinishedExecutingTransactions ? (
        <>
          <Title>Processing Transactions</Title>
          <TransactionStatusWrapper>
            <TransactionList transactions={transactions}></TransactionList>
          </TransactionStatusWrapper>
          <ANButton
            buttonType="primary"
            disabled={!isFinishedExecutingTransactions}
            label={
              isFinishedExecutingTransactions
                ? 'Continue'
                : 'Please do not close this window until it finishes'
            }
            width="100%"
            height="55px"
            labelColor="white"
            onClick={
              isFinishedExecutingTransactions ? closeModal : executeTransactions
            }
          />
        </>
      ) : (
        <>
          <Title>Confirm transactions</Title>
          <TransactionMessagesCard>
            <BoldText>Transactions to be triggered</BoldText>
            <TransactionListWrapper>
              {transactions.map((tx) => {
                return (
                  <TransactionListItem key={tx.message?.slice(0, 20)}>
                    <MessageText>{tx.message}</MessageText>
                  </TransactionListItem>
                );
              })}
            </TransactionListWrapper>
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
