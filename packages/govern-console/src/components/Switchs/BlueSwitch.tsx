import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch, { SwitchProps } from '@material-ui/core/Switch';

/**
 * UI Switch component for user interaction
 */

const useStyles = makeStyles({
  root: {
    width: 'auto',
    height: '50px',
  },
  track: {
    width: '46px',
    height: '22px',
    borderRadius: '32px',
    '$checked$checked + &': {
      opacity: 0.7,
      backgroundColor: '#FFFFFF',
    },
  },
  switchBase: {
    '&$checked': {
      color: '#01B9F2',
      transform: 'translateX(24px)',
    },
    '& + $track': {
      backgroundColor: '#FFFFFF',
      opacity: 0.7,
      borderColor: '#EFF1F7',
      border: '2px solid',
      boxShadow: 'inset 2px 2px 2px rgba(116, 131, 178, 0.25)',
    },
  },
  checked: {},
  thumb: {
    color: '#01B9F2',
    marginTop: '6px',
    marginLeft: '6px',
    transform: 'translateX(0px)',
    background: 'linear-gradient(107.79deg, #01B9F2 1.46%, #01DBE9 100%)',
  },
});

export const BlueSwitch: React.FC<SwitchProps> = ({ ...props }) => {
  const classes = useStyles();

  return (
    <Switch
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        checked: classes.checked,
        track: classes.track,
        thumb: classes.thumb,
      }}
      {...props}
    />
  );
};
