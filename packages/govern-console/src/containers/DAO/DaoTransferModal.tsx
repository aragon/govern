import { Modal } from '@aragon/ui';
import styled from 'styled-components';
import SelectToken from './components/ModalContents/SelectToken';
import NewTransfer from './components/ModalContents/NewTransfer';
import SignDeposit from './components/ModalContents/SignDeposit';

const TransferModal = styled(Modal)`
  & > div > div > div {
    border-radius: 16px !important;
    background: #f6f9fc;
    max-height: 768px;
    overflow: auto;
    max-width: 487px;
  }
`;

const DaoTransferModal: React.FC<{ opened: boolean; close: () => void }> = ({ opened, close }) => {
  return (
    <>
      <TransferModal visible={opened} onClose={close}>
        <SignDeposit />
      </TransferModal>
    </>
  );
};

export default DaoTransferModal;
