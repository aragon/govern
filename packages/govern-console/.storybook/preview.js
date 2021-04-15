import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '../src/AragonTheme';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import '../src/App.css';

export const decorators = [
  (Story) => (
    <ThemeProvider theme={lightTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Story />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  ),
];
