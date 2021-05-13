/* eslint-disable */
import Modal, { ModalProps } from '@material-ui/core/Modal';
import { useTheme, styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ANWrappedPaper } from '../WrapperPaper/ANWrapperPaper';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export interface SimpleModalProps extends ModalProps {
  /**
   * Title text of the modal
   */
  modalTitle?: string;
}

const NakedModal = styled(Modal)({
  height: '100%',
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
});

const Title = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 28,
  lineHeight: '38px',
  color: '#20232C',
  marginTop: 17,
  height: 50,
  display: 'flex',
  justifyContent: 'start',
});

const ModalCloseButton = styled('div')({
  height: 18,
  width: 18,
  cursor: 'pointer',
  position: 'relative',
  left: '90%',
  marginBottom: '-10px',
});

export const SimpleModal: React.FC<SimpleModalProps> = (props: SimpleModalProps) => {
  return (
    <NakedModal {...props}>
      <ANWrappedPaper style={{ boxShadow: '0px 13px 9px 0px rgb(102, 102, 102, 0.35)' }}>
        <ModalCloseButton>
          <IconButton
            aria-label="close"
            onClick={() => {
              typeof props.onClose !== 'undefined' ? props.onClose({}, 'backdropClick') : null;
            }}
          >
            <CloseIcon />
          </IconButton>
        </ModalCloseButton>
        <Title>{props.modalTitle}</Title>
        {props.children}
      </ANWrappedPaper>
    </NakedModal>
  );
};
