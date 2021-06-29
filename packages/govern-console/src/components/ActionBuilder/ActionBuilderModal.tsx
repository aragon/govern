import { ReactNode } from 'react';
import { Modal, IconCross, ButtonIcon, GU } from '@aragon/ui';

type ActionBuilderModalProps = {
  visible: boolean;
  onClose: () => void;
  children: () => ReactNode;
};

export const ActionBuilderModal: React.FC<ActionBuilderModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal visible={visible} closeButton={false}>
      <ButtonIcon
        label="Close"
        onClick={() => onClose()}
        css={`
          position: absolute;
          z-index: 2;
          top: ${2 * GU}px;
          right: ${2 * GU}px;
        `}
      >
        <IconCross />
      </ButtonIcon>
      {children()}
    </Modal>
  );
};
