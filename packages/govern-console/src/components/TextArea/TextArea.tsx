import React, { memo, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

const TextArea: React.FC<TextFieldProps> = ({ ...props }) => {
  return (
    <>
      <TextField {...props} />
    </>
  );
};

export default memo(TextArea);
