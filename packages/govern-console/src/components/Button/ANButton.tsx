import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export interface ANButtonProps {
  /**
   * Button buttonType
   */
  buttonType: string;
  /**
   * If you want to override the color
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string | React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Disable button
   */
  disabled?: boolean;
  /**
   * width
   */
  width?: string;
  /**
   * height
   */
  height?: string;
  /**
   * Color value
   */
  labelColor?: string;
  /**
   * style
   */
  style?: any;
  /**
   * Type of button
   */
  type?: 'button' | 'submit';
}

const getBackground = (
  buttonType: string,
  theme: Theme,
  disabled?: boolean,
  backgroundColor?: string,
) => {
  if (disabled) return `${theme.custom.greyscale.light} !important`;
  if (backgroundColor) return backgroundColor;
  if (buttonType === 'primary')
    return 'linear-gradient(107.79deg, #00C2FF 1.46%, #01E8F7 100%) !important';
  if (buttonType === 'challenge')
    return 'linear-gradient(107.79deg, #F7B201 1.46%, #FF7A00 100%) !important';
  return '#ffffff !important';
};
const getBackgroundForHoveredState = (
  buttonType: string,
  theme: Theme,
  disabled?: boolean,
  backgroundColor?: string,
) => {
  if (disabled) return '#D9E0F5 !important';
  if (backgroundColor) return backgroundColor;
  if (buttonType === 'primary')
    return 'linear-gradient(107.79deg, #82E1FF 1.46%, #3CF3FF 100%) !important';
  if (buttonType === 'challenge')
    return 'linear-gradient(107.79deg, #FFD056 1.46%, #FF9636 100%) !important';
  return '#ffffff !important';
};
const getBackgroundForPressedState = (
  buttonType: string,
  theme: Theme,
  disabled?: boolean,
  backgroundColor?: string,
) => {
  if (disabled) return '#D9E0F5 !important';
  if (backgroundColor) return backgroundColor;
  if (buttonType === 'primary')
    return 'linear-gradient(107.79deg, #01B9F2 1.46%, #01DBE9 100%) !important';
  if (buttonType === 'challenge')
    return 'linear-gradient(107.79deg, #EBA900 1.46%, #ED7100 100%) !important';
  return '#EFF1F7 !important';
};

const getColor = (buttonType: string, color?: string, disabled?: boolean) => {
  if (disabled) return '#B0BDE5 !important';
  if (color && color !== '') return color;
  if (buttonType === 'secondary') return '#20232C !important';
  return '#ffffff !important';
};

const StyledButton = styled(Button)(
  ({
    theme,
    kind,
    background,
    disabled,
    width,
    height,
    label,
  }: {
    theme: Theme;
    kind: string;
    background?: string;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    disabled?: boolean;
    width?: string;
    height?: string;
    label?: string;
    style?: any;
  }) => ({
    color: getColor(kind, label, disabled),
    height: height || 46,
    width: width || 154,
    background: getBackground(kind, theme, disabled, background),
    boxSizing: 'border-box',
    boxShadow: disabled ? 'none !important' : '0px 3px 3px rgba(116, 131, 178, 0.2)',
    borderRadius: '8px',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '22px',
    textTransform: 'none',
    animation: 'none',
    cursor: 'pointer',
    transition: 'background 0.5s, color 0.5s',
    '&:hover': {
      background: getBackgroundForHoveredState(kind, theme, disabled, background),
      boxShadow: '0px 4px 4px rgba(116, 131, 178, 0.25)',
      color: kind === 'secondary' ? '#7483B2' : 'white',
    },
    '&:active': {
      background: getBackgroundForPressedState(kind, theme, disabled, background),
      boxShadow: '0px 1px 1px rgba(116, 131, 178, 0.35)',
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
  }),
);

export const ANButton: React.FC<ANButtonProps> = ({
  buttonType: buttonType = 'primary',
  backgroundColor,
  label,
  disabled,
  width,
  height,
  labelColor,
  style,
  onClick,
}) => {
  return (
    <StyledButton
      onClick={
        disabled
          ? () => {
              return;
            }
          : onClick
      }
      background={backgroundColor}
      disabled={disabled}
      width={width}
      kind={buttonType}
      height={height}
      label={labelColor}
      style={style}
    >
      {label}
    </StyledButton>
  );
};
