import React from 'react';
import {
  TransactionSubtitle,
  TransactionKeeperTitle,
  TransactionKeeperWrapper,
  TransactionResultImage,
  TransactionStatusWrapper,
} from './TransactionKeeperStyles';
import { ANButton } from 'components/Button/ANButton';
import CrossImage from '../../images/svgs/cross.svg';
import TransactionList, {
  TransactionListProps,
} from 'components/TransactionKeeper/TransactionList';

export interface TransactionKeeperFailureProps extends TransactionListProps {
  onClick: () => void;
}

const TransactionKeeperFailure: React.FC<TransactionKeeperFailureProps> = ({
  onClick,
  transactions,
}) => {
  return (
    <TransactionKeeperWrapper>
      <TransactionKeeperTitle>Something went wrong</TransactionKeeperTitle>
      <TransactionResultImage src={CrossImage} />
      <TransactionStatusWrapper>
        <TransactionList transactions={transactions}></TransactionList>
      </TransactionStatusWrapper>
      <TransactionSubtitle>
        An error has occurred during the signature process. Do not worry, you can try again.
      </TransactionSubtitle>
      <ANButton buttonType="primary" label="OK" width="100%" height="45px" onClick={onClick} />
    </TransactionKeeperWrapper>
  );
};

export default React.memo(TransactionKeeperFailure);
