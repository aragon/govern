import { Modal } from '@aragon/ui';
import styled from 'styled-components';
import SelectToken from './components/ModalContents/SelectToken';

const TransferModal = styled(Modal)`
  & > div > div > div {
    border-radius: 16px;
    background: #f6f9fc;
    max-height: 768px;
    overflow: auto;
  }
`;

const DaoTransferModal: React.FC<{ opened: boolean; close: () => void }> = ({ opened, close }) => {
  return (
    <>
      <TransferModal visible={opened} onClose={close}>
        <SelectToken />
      </TransferModal>
    </>
  );
};

export default DaoTransferModal;
