import React from 'react';
import Dialog from './Dialog';
import GreenTickImage from 'images/svgs/green_tick.svg';

export interface SuccessDialogProps {
  /**
   * Dialog title
   */
  title: string;

  /**
   * Dialog sub title
   */
  subTitle: string;

  /**
   * label on the button
   */
  buttonLabel: string;

  /**
   * button click handler
   */
  onClick: () => void;

  /**
   * render the dialog with paper style or plain dialog style
   */
  paperStyle?: boolean;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  title,
  subTitle,
  buttonLabel,
  onClick,
  paperStyle,
}) => {
  return (
    <Dialog
      image={GreenTickImage}
      title={title}
      subTitle={subTitle}
      button={{ label: buttonLabel, onClick }}
      paperStyle={paperStyle}
    ></Dialog>
  );
};

export default SuccessDialog;
