/* eslint-disable */
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';

export interface InputFieldProps extends StandardTextFieldProps {
  /**
   * Label of the field
   */
  label: string;
  /**
   * Placeholder
   */
  placeholder: string;
  /**
   * Function to be called onChange
   */
  onInputChange: (val: string) => void;
  /**
   * Height of the input box
   */
  height: string;
  /**
   * Width of the input box
   */
  width: string;
  value?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  onInputChange,
  placeholder,
  label,
  height,
  width,
  value,
  ...props
}) => {
  const theme = useTheme();
  const inputLabelStyles = makeStyles({
    root: {
      color: `${theme.custom.greyscale.medium}`,
      //   marginLeft: '0.75rem',
      display: 'none',
    },
    // TODO: handle error
    // error: {
    //   '&.MuiInputBase-root.MuiInput-root.Mui-error.MuiInputBase-formControl.MuiInput-formControl.MuiInputBase-input.MuiInput-input': {
    //     border: `2px solid #670AE5`,
    //   }
    // },
    focused: {},
    shrink: {
      transform: 'translate(0, 1.5px) scale(1)',
    },
  });
  const inputLabelClasses = inputLabelStyles();

  const inputBaseStyles = makeStyles({
    root: {
      padding: '0px',
      margin: '0px',
    },
    input: {
      padding: '0px 0px 0px 24px',
      boxSizing: 'border-box',
      margin: '0px',
      color: `${theme.custom.black}`,
      fontSize: 16,
      fontWeight: 400,
      '&::placeholder': {
        textOverflow: 'ellipsis !important',
        color: `#7483AB`,
        marginLeft: '24px',
      },
      backgroundColor: theme.custom.white,
      border: `2px solid #EFF1F7`,
      borderRadius: '8px',
      height: height || '46px',
      width: width || '200px',
    },
    // TODO: handle error
    // error: {
    //   '&.MuiInputBase-root.MuiInput-root.Mui-error.MuiInputBase-formControl.MuiInput-formControl.MuiInputBase-input.MuiInput-input': {
    //     border: `2px solid #FF6A60`,
    //   }
    // },
    formControl: {
      'label + &': {
        padding: '13px 16px',
        margin: '0px',
      },
    },
  });
  const inputBaseClasses = inputBaseStyles();

  const helperTextStyles = makeStyles({
    root: {
      // marginTop: -10,
      marginLeft: 10,
    },
    error: {
      '&.MuiFormHelperText-root.Mui-error': {
        color: '#FF6A60',
      },
    },
  });
  const helperTextClasses = helperTextStyles();
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      margin={'none'}
      InputLabelProps={{ shrink: true, classes: inputLabelClasses }}
      InputProps={{ classes: inputBaseClasses, disableUnderline: true }}
      FormHelperTextProps={{ classes: helperTextClasses }}
      onChange={(e) => onInputChange(e.target.value)}
      value={value}
      error={props.error}
      {...props}
    />
  );
};
