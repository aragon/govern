import { useState, useEffect } from 'react';
import { Modal } from '@aragon/ui';
import styled from 'styled-components';
import SelectToken from './components/ModalContents/SelectToken';
import NewTransfer from './components/ModalContents/NewTransfer';
import SignDeposit from './components/ModalContents/SignDeposit';
import ReviewDeposit from './components/ModalContents/ReviewDeposit';

const TransferModal = styled(Modal)`
  & > div > div > div {
    border-radius: 16px !important;
    background: #f6f9fc;
    max-height: 768px;
    overflow: auto;
    max-width: 487px;
  }
`;

function selectStep(step: number) {
  switch (step) {
    case 1:
      return <NewTransfer />;
    case 2:
      return <SelectToken />;
    case 3:
      return <ReviewDeposit />;
    case 4:
      return <SignDeposit />;
    default:
      console.log('Error - Invalid step');
  }
}

const DaoTransferModal: React.FC<{ opened: boolean; close: () => void }> = ({ opened, close }) => {
  // Provider react-hook-form setup here
  const [step, setStep] = useState<number>(0);

  //TODO change logic

  useEffect(() => {
    if (!opened) setStep(0);
  }, [opened]);

  return (
    <TransferModal
      visible={opened}
      onClose={close}
      // onClick={() => setStep((prestep) => prestep + 1)}
    >
      <NewTransfer />
    </TransferModal>
  );
};

export default DaoTransferModal;
