import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import MUIChip, { ChipProps } from '@material-ui/core/Chip';

export interface LabelProps extends ChipProps {
  /**
   * Label Color
   */
  labelColor: string;
  /**
   * Label Text
   */
  labelText: string | React.ReactNode;
  /**
   * Optional Function Handler
   */
  onClick?: () => void;
}

export const Label: React.FC<any> = ({
  labelColor,
  labelText,
  onClick,
  ...props
}) => {
  const theme = useTheme();
  const getBackground = () => {
    if (labelColor === 'green') return `${theme.custom.informative.green}`;
    if (labelColor === 'orange') return `${theme.custom.informative.orange}`;
    if (labelColor === 'yellow') return `${theme.custom.informative.yellow}`;
    if (labelColor === 'red') return `${theme.custom.informative.red}`;
    if (labelColor === 'white') return `${theme.custom.white}`;
    if (labelColor === 'grey') return `${theme.custom.greyscale.soft}`;
  };

  const getColor = () => {
    if (labelColor === 'green') return `${theme.custom.white}`;
    if (labelColor === 'orange') return `${theme.custom.white}`;
    if (labelColor === 'yellow') return `${theme.custom.white}`;
    if (labelColor === 'red') return `${theme.custom.white}`;
    if (labelColor === 'white') return `${theme.custom.black}`;
    if (labelColor === 'grey') return `${theme.custom.greyscale.solid}`;
  };

  const getBorder = () => {
    if (labelColor === 'white') {
      return `2px solid ${theme.custom.greyscale.soft}`;
    } else {
      return 'none';
    }
  };

  const Label = styled(MUIChip)({
    color: getColor(),
    backgroundColor: getBackground(),
    width: 'fit-content',
    height: '19px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1px 8px 2px',
    borderRadius: '40px',
    border: getBorder(),
    '& .MuiChip-label': {
      lineHeight: '10px',
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: 'Manrope',
      fontStyle: 'normal',
      overflow: 'visible',
    },
  });

  return <Label label={labelText}></Label>;
};
