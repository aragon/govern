/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import { useTheme, styled, Theme } from '@material-ui/core/styles';

export interface TowSidedSwitchProps {
    /*
    UI element on the left
    */
    leftSide?: string | React.ReactNode;
    /*
    UI element on the right
    */
    rightSide?: string | React.ReactNode;
    /*

    */
    getChecked(state: boolean): any;
}

export const TwoSidedSwitch:React.FC<TowSidedSwitchProps> = ({
    leftSide,
    rightSide,
    getChecked
}) => {

  const [state, setState] = useState({
    checked: false,
  });

  const handleChange = (event: any) => {
      console.log(state)
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect( () => {
      console.log('in effect',state)
    getChecked(state.checked);
  }, [state]);

  // TODO: change style
  const ANSwitch = styled(Switch) ({
      color: 'linear-gradient(107.79deg, #00C2FF 1.46%, #01E8F7 100%)',
  });

  return (
    <div 
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '25px',
            verticalAlign: 'center'
        }}
    >
        <div>{leftSide}</div>
        <ANSwitch
            checked={state.checked}
            onChange={handleChange}
            name="checked"
            color='primary'
            // inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <div>{rightSide}</div>
    </div>
  );
}