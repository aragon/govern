import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import { ANButton } from '../Button/ANButton';
import TextField from '@material-ui/core/TextField';
import removeOptionIcon from '../../images/ds/remove-option.svg';
export interface ProposalOptionsProps {
  /**
   * Current set of Options
   */
  options: Array<any>;
  /**
   * Callback to Add Option
   */
  onAddOption: any;
  /**
   * Callback to delete an option
   */
  onDeleteOption: any;
  /**
   * Callback to update the current selected option
   */
  onUpdateOption: any;
  /**
   * width of the widget
   */
  width: string;
  /**
   * height of the widget
   */
  height: string;
}

const StyledTextField = styled(TextField)(
  ({ width, height }: { width: string; height: string }) => ({
    background: '#FFFFFF',
    border: '1px solid #D9E0F5',
    boxSizing: 'border-box',
    borderRadius: 8,
    textAlign: 'center',
    width: width || 396,
    height: height || 46,
    display: 'block',
    marginBottom: 12,
    paddingLeft: 18,
    paddingRight: 18,
    '& .MuiInput-root': {
      width: '100%',
      height: '100%',
    },
    '& .MuiInputBase-input': {
      textAlign: 'center',
      width: '100%',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline': {
      '&::before': {
        borderBottom: 'none',
      },
      '&::after': {
        borderBottom: 'none',
      },
    },
  }),
);

/**
 * Primary UI component for user interaction
 */
const ProposalOptions: React.FC<ProposalOptionsProps> = ({
  options,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
  width,
  height,
  ...props
}) => {
  // const [val, setVal] = React.useState('0');

  return (
    <>
      {options.map((option, index) => {
        return (
          <StyledTextField
            key={option.value + index}
            value={option.value}
            onChange={(e) => {
              onUpdateOption(e.target.value, index);
            }}
            width={width}
            height={height}
            InputProps={{
              startAdornment: index,
              endAdornment:
                options.length > 1 ? (
                  <img
                    src={removeOptionIcon}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onDeleteOption(index)}
                  />
                ) : null,
            }}
          />
        );
      })}
      <ANButton
        onClick={onAddOption}
        buttonType="secondary"
        label="Add option"
        width={width || '396px'}
        height={height || '46px'}
      />
    </>
  );
};

export default ProposalOptions;
