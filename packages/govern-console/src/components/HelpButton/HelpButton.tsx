import React, { ReactChild, ReactFragment, ReactPortal } from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Button, { ButtonProps } from '@material-ui/core/Button';
// import { div } from '@material-ui/core';
import MuiTooltip from '@material-ui/core/Tooltip';

import helpIcon from '../../images/ds/help-icon.svg';

export interface HelpButtonProps extends ButtonProps {
  /**
   * Help text to show on hover
   */
  helpText: boolean | ReactChild | ReactFragment | ReactPortal;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ helpText }) => {
  const theme = useTheme();

  const HelpButtonDiv = styled(Button)({
    height: 16,
    width: 16,
    minWidth: 16,
    background: '#635BFF',
    filter: 'drop-shadow(0px 3px 3px rgba(116, 131, 178, 0.25))',
    boxSizing: 'border-box',
    boxShadow: '0px 3px 3px 0px rgba(116, 131, 178, 0.25)',
    borderRadius: '50%',
    textTransform: 'none',
    animation: 'none',
    transition: 'none',
    '&:hover': {
      background: '#8991FF',
      boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
    // ...style,
  });

  const HelpToolTip = styled(MuiTooltip)({
    '& .MuiTooltip-popper': {
      maxWidth: 300,
      background: theme.custom.light.violet,
    },
    '& .MuiTooltip-tooltip': {
      background: theme.custom.light.violet,
      color: theme.custom.plain.amethyst,
    },
  });

  return (
    <HelpToolTip title={helpText} interactive>
      <HelpButtonDiv>
        <img
          src={helpIcon}
          // onMouseEnter={() => {}} onMouseLeave={() => {}}
        />
      </HelpButtonDiv>
    </HelpToolTip>
  );
};
