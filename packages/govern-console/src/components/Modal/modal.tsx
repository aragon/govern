import React from 'react';
import Dialog from '@material-ui/core/Dialog';

export default function CustomizedDialogs(
  content: React.ReactNode,
  onOpen: any,
  onClose: any,
  open: boolean,
) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      {content}
    </Dialog>
  );
}
