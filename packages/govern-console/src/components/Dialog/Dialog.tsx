import React from 'react';
import { ANButton } from 'components/Button/ANButton';
import { CloseButton } from 'components/Button/CloseButton';
import { ANWrappedPaper } from 'components/WrapperPaper/ANWrapperPaper';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export interface DialogProps {
  /**
   * title of the dialog
   */
  title: string;

  /**
   * sub title of the dialog
   */
  subTitle?: string;

  /**
   * image to be displayed on the dialog
   */
  image?: string;

  /**
   * button handler and label
   */
  button?: {
    label: string;
    onClick: () => void;
  };

  /**
   * close button handler
   */
  onClose?: () => void;

  /**
   * paper style dialog
   */
  paperStyle?: boolean;
}

const Title = styled(Typography)(({ theme }) => ({
  ...theme.custom.transactionKeeper.title,
  textAlign: 'center',
  marginBottom: '21px',
}));

const DialogWrapper = styled('div')({
  margin: '32px',
  borderRadius: '16px',
  width: '440px',
});

const SubTitle = styled('div')({
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
  textAlign: 'center',
  margin: '0 auto',
});

const Image = styled('img')({
  position: 'relative',
  display: 'block',
  width: '70',
  margin: '0 auto',
  paddingBottom: '10px',
});

const Dialog: React.FC<DialogProps> = ({
  title,
  subTitle,
  image,
  button,
  onClose,
  children,
  paperStyle,
}) => {
  const Content = () => {
    return (
      <>
        {onClose ? <CloseButton onClick={onClose} /> : null}
        {image && <Image src={image} />}
        <Title>{title}</Title>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        {children}
        {button && (
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <ANButton
              width={'446px'}
              label={button.label}
              buttonType="primary"
              style={{ marginTop: 40 }}
              onClick={button.onClick}
            />
          </div>
        )}
      </>
    );
  };

  if (paperStyle) {
    return (
      <ANWrappedPaper>
        <Content />
      </ANWrappedPaper>
    );
  } else {
    return (
      <DialogWrapper>
        <Content />
      </DialogWrapper>
    );
  }
};

export default Dialog;
