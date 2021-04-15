import React, { useState } from 'react';
import { deepPurple } from '@material-ui/core/colors';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Original design here: https://github.com/siriwatknp/mui-treasury/issues/541

export const Dropdown: React.FC<any> = ({ ...props }) => {
  const theme = useTheme();
  const aaragonDropDownStyles = makeStyles({
    select: {
      minWidth: 567,
      background: theme.custom.white,
      color: theme.custom.black,
      fontWeight: 400,
      border: `1px solid ${theme.custom.greyscale.soft}`,
      borderRadius: 8,
      padding: '13px 16px',
      '&:focus': {
        borderRadius: 8,
        background: 'white',
        borderColor: `${theme.custom.greyscale.soft}`,
      },
    },
    icon: {
      color: `${theme.custom.black}`,
      right: 19,
      position: 'absolute',
      userSelect: 'none',
      pointerEvents: 'none',
    },
    paper: {
      borderRadius: 8,
      marginTop: 8,
    },
    list: {
      padding: '0px',
      background: 'white',
      border: `1px solid ${theme.custom.greyscale.soft}`,
      '& li': {
        fontWeight: 400,
        padding: '13px 16px',
      },
      '& li:hover': {
        background: `${theme.custom.greyscale.light}`,
        color: `${theme.custom.black}`,
      },
      '& li.Mui-selected': {
        color: `${theme.custom.black}`,
        background: `${theme.custom.greyscale.light}`,
        borderBottom: `1px solid ${theme.custom.greyscale.soft}`,
      },
      '& li.Mui-selected:hover': {
        background: `${theme.custom.greyscale.light}`,
      },
    },
  });
  const classes = aaragonDropDownStyles();
  const [val, setVal] = useState(1);

  const handleChange = (event: any) => {
    setVal(event.target.value);
  };

  const iconComponent = (props: any) => {
    return <ExpandMoreIcon className={props.className + ' ' + classes.icon} />;
  };

  // moves the menu below the select input
  const menuProps = {
    classes: {
      paper: classes.paper,
      list: classes.list,
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
  };

  return (
    <FormControl>
      <Select
        disableUnderline
        classes={{ root: classes.select }}
        // MenuProps={menuProps}
        IconComponent={iconComponent}
        value={val}
        onChange={handleChange}
      >
        <MenuItem value={0}>Principle</MenuItem>
        <MenuItem value={1}>Sketch</MenuItem>
        <MenuItem value={2}>Photoshop</MenuItem>
        <MenuItem value={3}>Framer</MenuItem>
      </Select>
    </FormControl>
  );
};
