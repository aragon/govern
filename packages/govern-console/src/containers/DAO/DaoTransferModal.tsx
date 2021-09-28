import { Modal } from '@aragon/ui';
import styled from 'styled-components';

const TransferModal = styled(Modal)`
  border-radius: 16px;
`;

const DaoTransferModal: React.FC<{ opened: boolean; close: () => void }> = ({ opened, close }) => {
  return (
    <>
      <TransferModal visible={opened} onClose={close}>
        modal content
      </TransferModal>
    </>
  );
};

export default DaoTransferModal;
