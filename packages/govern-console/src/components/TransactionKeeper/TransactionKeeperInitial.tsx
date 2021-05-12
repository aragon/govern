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
import { styled } from '@material-ui/core/styles';
import MUICard from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const TransactionMessagesCard = styled(MUICard)(({ theme }) => ({
  ...theme.custom.transactionKeeper.transactionMessagesCard,
  padding: '16px',
  marginBottom: '16px',
}));
const BoldText = styled(Typography)(({ theme }) => ({
  ...theme.custom.transactionKeeper.transactionMessagesCard.boldText,
}));

export interface TranasctionKeeperInitialProps extends TransactionListProps {
  onClick: () => void;
}

const TransactionKeeperInitial: React.FC<TranasctionKeeperInitialProps> = ({
  transactions,
  onClick,
}) => {
  return (
    <TransactionKeeperWrapper>
      <TransactionKeeperTitle>Processing transactions</TransactionKeeperTitle>
      <TransactionMessagesCard>
        <BoldText>Transactions to be triggered</BoldText>
        <TransactionStatusWrapper>
          <TransactionList transactions={transactions}></TransactionList>
        </TransactionStatusWrapper>
      </TransactionMessagesCard>
      <ANButton
        buttonType="primary"
        label="Get Started"
        width="100%"
        height="45px"
        onClick={onClick}
      />
    </TransactionKeeperWrapper>
  );
};

export default React.memo(TransactionKeeperInitial);
