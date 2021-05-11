/* eslint-disable */
import React, { useState, memo } from 'react';
import { styled, Theme } from '@material-ui/core/styles';
import MUICard, { CardProps } from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { ANButton } from 'components/Button/ANButton';
import { AdviceMessage } from 'components/AdviceMessages/AdviceMessage';
import Snackbar from '@material-ui/core/Snackbar';

export interface ToastProps {
  /**
   * Type of toast
   */
  type: string;
  /**
   * Message to be shown
   */
  message: string | React.ReactNode;
  /**
   * Optional Function Handler
   */
  onClose?: () => void;
  /**
   * Open toast or not
   */
  isOpen: boolean;
  /**
   * Vertical positions
   */
  verticalPosition: 'top' | 'bottom';
  /**
   * Horizontal position
   */
  horizontalPosition: 'left' | 'right' | 'center';
}

const getBackground = (theme: Theme, type: string) => {
  if (type === 'success') return `${theme.custom.light.grass}`;
  if (type === 'warning') return `${theme.custom.light.cream}`;
  if (type === 'infromation') return `${theme.custom.light.sky}`;
  if (type === 'error') return '#F8E8EB';
  return `${theme.custom.greyscale.light}`;
};

const getColor = (theme: Theme, type: string) => {
  if (type === 'success') return `${theme.custom.informative.green}`;
  if (type === 'warning') return `${theme.custom.informative.orange}`;
  if (type === 'information') return `${theme.custom.plain.sapphire}`;
  if (type === 'error') return '#FF6A60';
  return `${theme.custom.greyscale.solid}`;
};

const ToastCard = styled(MUICard)(
  ({ theme, type }: { theme: Theme; type: string }) => ({
    backgroundColor: getBackground(theme, type),
    width: '293px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 16px',
    borderRadius: '10px',
  }),
);

const ToastMessage = styled(MUITypography)(
  ({ theme, type }: { theme: Theme; type: string }) => ({
    color: getColor(theme, type),
    lineHeight: '19px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    overflow: 'visible',
  }),
);

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isOpen,
  onClose,
  verticalPosition,
  horizontalPosition,
  ...props
}) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{
        vertical: verticalPosition,
        horizontal: horizontalPosition,
      }}
    >
      <ToastCard type={type}>
        <ToastMessage type={type}>{message}</ToastMessage>
      </ToastCard>
    </Snackbar>
  );
};

export default memo(Toast);
