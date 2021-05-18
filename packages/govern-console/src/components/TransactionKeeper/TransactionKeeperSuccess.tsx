import React from 'react';
import {
  TransactionKeeperTitle,
  TransactionKeeperWrapper,
  TransactionResultImage,
  TransactionSubtitle,
} from './TransactionKeeperStyles';
import { ANButton } from 'components/Button/ANButton';
import GreenTickImage from '../../images/svgs/green_tick.svg';

export interface TransactionKeeperSuccessProps {
  onClick: () => void;
}

const TransactionKeeperSuccess: React.FC<TransactionKeeperSuccessProps> = ({ onClick }) => {
  return (
    <TransactionKeeperWrapper>
      <TransactionKeeperTitle>Success</TransactionKeeperTitle>
      <TransactionResultImage src={GreenTickImage} />
      <TransactionSubtitle>
        Congratulations. Your transaction completed successfully.
      </TransactionSubtitle>
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

export default React.memo(TransactionKeeperSuccess);
