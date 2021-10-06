import { useState, useEffect } from 'react';
import { Modal } from '@aragon/ui';
import styled from 'styled-components';
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

const DaoTransferModal: React.FC<{ opened: boolean; close: () => void; daoName: string }> = ({
  opened,
  close,
  daoName,
}) => {
  // Provider react-hook-form setup here
  const [step, setStep] = useState<string>('newTransfer');
  const [formInfo, setFormInfo] = useState({});

  function selectStep() {
    switch (step) {
      case 'newTransfer':
        return (
          <NewTransfer
            next={() => setStep('SelectToken')}
            setFormInfo={(value) => setFormInfo(value)}
          />
        );
      case 'ReviewDeposit':
        return <ReviewDeposit formInfo={formInfo} daoName={daoName} />;
      case 'SignDeposit':
        return <SignDeposit />;
      default:
        console.log('Error - Invalid step');
    }
  }

  useEffect(() => {
    if (!opened) setStep('newTransfer');
  }, [opened]);

  return (
    <TransferModal
      visible={opened}
      onClose={close}
      // onClick={() => setStep((prestep) => prestep + 1)}
    >
      {selectStep()}
    </TransferModal>
  );
};

export default DaoTransferModal;
