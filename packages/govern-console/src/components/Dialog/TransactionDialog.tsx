import React from 'react';
import Dialog from './Dialog';
import { CustomTransaction } from 'utils/types';
import TransactionList from './TransactionList';
import { styled } from '@material-ui/core/styles';

export interface TransactionDialogProps {
  /**
   * Dialog title
   */
  title: string;

  /**
   * label for the main button
   */
  buttonLabel?: string;

  /**
   * message
   */
  info?: string;

  /**
   * transactions to show on the dialog box
   */
  transactions: CustomTransaction[];

  /**
   * button click handler
   */
  onClick?: () => void;

  /**
   * dialog close handler
   */
  onClose?: () => void;
}

const Info = styled('div')({
  color: '#5863FF',
  textAlign: 'center',
  fontSize: '16px',
  marginTop: '40px',
  width: '100%',
  lineHeight: '51px',
  background: '#ECFAFF',
  borderRadius: '10px',
});

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  title,
  info,
  transactions,
  buttonLabel,
  onClick,
  onClose,
}) => {
  const button = onClick
    ? {
        onClick,
        label: buttonLabel || 'Continue',
      }
    : undefined;

  return (
    <Dialog onClose={onClose} title={title} button={button}>
      <TransactionList transactions={transactions}></TransactionList>
      {info && <Info>{info}</Info>}
    </Dialog>
  );
};

export default TransactionDialog;
