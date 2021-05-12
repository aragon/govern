import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';
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

const getBackground = (labelColor: string, theme: Theme) => {
  if (labelColor === 'green') return `${theme.custom.informative.green}`;
  if (labelColor === 'orange') return `${theme.custom.informative.orange}`;
  if (labelColor === 'yellow') return `${theme.custom.informative.yellow}`;
  if (labelColor === 'red') return `${theme.custom.informative.red}`;
  if (labelColor === 'white') return `${theme.custom.white}`;
  if (labelColor === 'grey') return `${theme.custom.greyscale.soft}`;
};

const getColor = (labelColor: string, theme: Theme) => {
  if (labelColor === 'green') return `${theme.custom.white}`;
  if (labelColor === 'orange') return `${theme.custom.white}`;
  if (labelColor === 'yellow') return `${theme.custom.white}`;
  if (labelColor === 'red') return `${theme.custom.white}`;
  if (labelColor === 'white') return `${theme.custom.black}`;
  if (labelColor === 'grey') return `${theme.custom.greyscale.solid}`;
};
const getBorder = (labelColor: string, theme: Theme): string => {
  if (labelColor === 'white') {
    return `2px solid ${theme.custom.greyscale.soft}`;
  } else {
    return 'none';
  }
};
const StyledLabel = styled(MUIChip)(
  ({ labelColor, theme }: { labelColor: string; theme: Theme }) => ({
    color: getColor(labelColor, theme),
    backgroundColor: getBackground(labelColor, theme),
    width: 'fit-content',
    height: '19px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1px 3px',
    borderRadius: '40px',
    border: getBorder(labelColor, theme),
    '& .MuiChip-label': {
      lineHeight: '10px',
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: 'Manrope',
      fontStyle: 'normal',
      overflow: 'visible',
    },
  }),
);

export const Label: React.FC<any> = ({
  labelColor,
  labelText,
  onClick,
  ...props
}) => {
  return <StyledLabel label={labelText} labelColor={labelColor} />;
};
