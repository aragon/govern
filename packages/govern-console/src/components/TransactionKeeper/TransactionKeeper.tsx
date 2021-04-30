import React from 'react';
import {
  CustomTransaction,
  CustomTransactionStatus,
  Response,
} from 'utils/types';
import { styled, useTheme } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/card';
import Typography from '@material-ui/core/typography';
import TransactionList from 'components/TransactionKeeper/TransactionList';
import { ANButton } from 'components/Button/ANButton';
import produce from 'immer';

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
  //* Styled Components
  const Wrapper = styled(MUICard)({
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '100%',
    height: 'fit-content',
    backgroundColor: theme.custom.transactionKeeper.wrapper.background,
    boxShadow: '0px 13px 9px rgba(180, 193, 228, 0.35)',
    borderRadius: '16px',
    padding: '27px 24px 24px 24px',
  });
  const Title = styled(Typography)({
    ...theme.custom.transactionKeeper.title,
    height: 'fit-content',
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'center',
    marginBottom: '21px',
  });
  const TransactionMessagesCard = styled(MUICard)({
    ...theme.custom.transactionKeeper.transactionMessagesCard,
    padding: '16px',
    marginBottom: '16px',
  });
  const BoldText = styled(Typography)({
    ...theme.custom.transactionKeeper.transactionMessagesCard.boldText,
  });
  const MessageText = styled(Typography)({
    ...theme.custom.transactionKeeper.transactionMessagesCard.text,
  });
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
    for (const transaction of transactions) {
      debugger;
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
        // onTransactionSuccess(updatedTransaction, transactionReceipt);
      } catch (ex) {
        const updatedTransaction = produce(transaction, (draft) => {
          draft.status = CustomTransactionStatus.Failed;
        });
        updateTransaction(updatedTransaction, index);
        // onTransactionFailure(ex.toString(), updatedTransaction);
      }
      index++;
    }
  }, [transactionList]);
  debugger;
  return (
    <Wrapper>
      {isProcessingTransactions ? (
        <>
          <Title>Confirm Transactions</Title>
          <TransactionStatusWrapper>
            <TransactionList transactions={transactions}></TransactionList>
          </TransactionStatusWrapper>
          <ANButton
            type="primary"
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
                  <li key={tx.preTransactionMessage?.slice(0, 20)}>
                    <MessageText>{tx.preTransactionMessage}</MessageText>
                  </li>
                );
              })}
            </ul>
          </TransactionMessagesCard>
          <ANButton
            type="primary"
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
