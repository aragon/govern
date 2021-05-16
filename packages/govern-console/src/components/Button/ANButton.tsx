import React from 'react';
import { styled, Theme, useTheme } from '@material-ui/core/styles';
import MUIButton from '@material-ui/core/Button';

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
  // /**
  //  * Any additional overwriting style.
  //  */
  // style: object;
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

const StyledButton = styled(MUIButton)(
  ({
    theme,
    buttonType,
    backgroundColor,
    disabled,
    width,
    height,
    labelColor,
    style,
  }: {
    theme: Theme;
    buttonType: string;
    backgroundColor?: string;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    disabled?: boolean;
    width?: string;
    height?: string;
    labelColor?: string;
    style?: any;
  }) => ({
    color: getColor(buttonType, labelColor, disabled),
    height: height || 46,
    width: width || 154,
    background: getBackground(buttonType, theme, disabled, backgroundColor),
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
      background: getBackgroundForHoveredState(buttonType, theme, disabled, backgroundColor),
      boxShadow: '0px 4px 4px rgba(116, 131, 178, 0.25)',
      color: buttonType === 'secondary' ? '#7483B2' : 'white',
    },
    '&:active': {
      background: getBackgroundForPressedState(buttonType, theme, disabled, backgroundColor),
      boxShadow: '0px 1px 1px rgba(116, 131, 178, 0.35)',
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
    // ...style,
  }),
);

export const ANButton: React.FC<ANButtonProps> = ({
  buttonType: buttonType = 'primary',
  // size = 'medium',
  backgroundColor,
  label,
  // style,
  disabled,
  width,
  height,
  labelColor,
  style,
  ...props
}) => {
  return (
    <StyledButton
      onClick={
        disabled
          ? () => {
              return;
            }
          : props.onClick
      }
      backgroundColor={backgroundColor}
      disabled={disabled}
      width={width}
      buttonType={buttonType}
      height={height}
      labelColor={labelColor}
      style={style}
    >
      {label}
    </StyledButton>
  );
};
