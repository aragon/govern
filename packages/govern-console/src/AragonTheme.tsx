import { createMuiTheme } from '@material-ui/core/styles';

interface CustomTheme {
  mainBackground: string;
  gradients: {
    aragon: string;
    challenge: string;
  };
  plain: {
    blue: string;
    cyan: string;
    sapphire: string;
    amethyst: string;
  };
  greyscale: {
    solid: string;
    medium: string;
    soft: string;
    light: string;
  };
  informative: {
    green: string;
    orange: string;
    yellow: string;
    red: string;
  };
  light: {
    cream: string;
    skin: string;
    sky: string;
    grass: string;
    violet: string;
  };
  daoCard: {
    background: string;
    border: string;
    labelColor: string;
    fontFamily: string;
    fontStyle: string;
    labeFontSize: string;
    labelLineHeight: string;
    labelFontWeight: number;
    propertyLabelFontWeight: number;
    propertLabelFontSize: number;
    propertyLabelLineHeight: string;
    propertyTextLineHeight: string;
    propertyTextFontWeight: number;
    propertyTextFontSize: string;
    propertyLabelColor: string;
    propertyTextColor: string;
  };
  proposalCard: {
    background: string;
    border: string;
    labelColor: string;
    labelFontSize: string;
    labelFontWeight: number;
    labelLineHeight: string;
    fontStyle: string;
    fontFamily: string;
    dateColor: string;
    dateFontSize: string;
    dateLineHeight: string;
    dateFontWeight: number;
  };
  daoHeader: {
    background: string;
    labelFontSize: string;
    labelLineHeight: string;
    labelColor: string;
    labelFontWeight: number;
    valueFontSize: string;
    valueFontWeight: number;
    valueLineHeight: string;
    valueColor: string;
  };
  modal: {
    labelFontSize: string;
    labelLineHeight: string;
    labelColor: string;
    labelFontWeight: number;
    valueFontSize: string;
    valueFontWeight: number;
    valueLineHeight: string;
    valueColor: string;
  };
  labels: {
    grey: string;
    orange: string;
    purple: string;
    green: string;
    red: string;
    black: string;
    lightBlue: string;
  };
  transactionKeeper: {
    wrapper: {
      background: string;
    };
    title: {
      fontStyle: string;
      fontFamily: string;
      fontWeight: number;
      fontSize: string;
      lineHeight: string;
      color: string;
    };
    transactionMessagesCard: {
      background: string;
      borderRadius: string;
      color: string;
      boldText: {
        fontStyle: string;
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      text: {
        fontStyle: string;
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
    };
  };
  black: string;
  white: string;
}

// https://material-ui.com/customization/theming/#custom-variables
declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    custom: CustomTheme;
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: CustomTheme;
  }
}

const typography = {
  fontFamily: 'Manrope',
  h1: {
    fontSize: 40,
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: 36,
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  h4: {
    fontSize: 18,
    fontWeight: 600,
  },
  h5: {
    fontSize: 12,
    fontWeight: 600,
  },
  text: {
    normal: {
      fontSize: 16,
      fontWeight: 500,
      color: '#7483B2',
    },
    link: {
      fontSize: 16,
      fontWeight: 500,
      color: '#0176FF',
    },
    bold: {
      fontSize: 16,
      fontWeight: 500,
      color: '#20232C',
    },
    small: {
      fontSize: 14,
      fontWeight: 500,
      color: '#20232C',
    },
  },
};

const custom = {
  mainBackground: '#F6F9FC',
  gradients: {
    aragon: 'linear-gradient(107.79deg, #00C2FF 1.46%, #01E8F7 100%)',
    challenge: 'linear-gradient(92.89deg, #F7B201 -16.92%, #FF7A00 100%)',
  },
  plain: {
    blue: '#00C2FF',
    cyan: '#01E8F7',
    sapphire: '#0176FF',
    amethyst: '#865BFF',
  },
  greyscale: {
    solid: '#7483B2',
    medium: '#B0BDE6',
    soft: '#D9E0F5',
    light: '#F5F7FF',
  },
  informative: {
    green: '#18D179',
    orange: '#FF7A00',
    yellow: '#FFC83A',
    red: '#FF5823',
  },
  light: {
    cream: '#FFF9EF',
    skin: '#FFF1ED',
    sky: '#ECFAFF',
    grass: '#EFFFF7',
    violet: '#F3F4FF',
  },
  daoCard: {
    background: '#FFFFFF',
    border: '#ECF1F7',
    labelColor: '-webkit-linear-gradient(107.79deg, #87E0FF 1.46%, #7A7AF7 100%)',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    labeFontSize: '24px',
    labelLineHeight: '30.02px',
    labelFontWeight: 600,
    propertyLabelFontWeight: 400,
    propertLabelFontSize: 15,
    propertyLabelLineHeight: '18.77px',
    propertyTextLineHeight: '27.52px',
    propertyTextFontWeight: 500,
    propertyTextFontSize: '22px',
    propertyLabelColor: '#7E89AC',
    propertyTextColor: '#20232C',
  },
  proposalCard: {
    background: '#FFFFFF',
    border: '#ECF1F7',
    labelColor: '#20232C',
    labelFontSize: '28px',
    labelFontWeight: 600,
    labelLineHeight: '38px',
    fontStyle: 'normal',
    fontFamily: 'Manrope',
    dateColor: '#7483AB',
    dateFontSize: '18px',
    dateLineHeight: '24.84px',
    dateFontWeight: 400,
  },
  daoHeader: {
    background: `linear-gradient(107.79deg, #E4F8FF 1.46%, #F1F1FF 100%)`,
    labelFontSize: '18px',
    labelLineHeight: '24.84px',
    labelColor: '#7483B3',
    labelFontWeight: 400,
    valueFontSize: '38px',
    valueFontWeight: 500,
    valueLineHeight: '51.91px',
    valueColor: '#20232C',
  },
  modal: {
    labelFontSize: '18px',
    labelLineHeight: '24.59px',
    labelColor: '#7483B3',
    labelFontWeight: 400,
    valueFontSize: '18px',
    valueFontWeight: 500,
    valueLineHeight: '24.59px',
    valueColor: '#20232C',
  },
  labels: {
    grey: '#7483AB',
    orange: 'linear-gradient(107.79deg, #FF7984 1.46%, #FFEB94 100%)',
    purple: '#635BFF',
    green: '#4BDD7C',
    red: '#FF6A60',
    black: '#20232C',
    lightBlue: '#00C2FF',
  },
  transactionKeeper: {
    wrapper: {
      background: '#ffffff',
    },
    title: {
      fontWeight: 500,
      fontSize: '28px',
      lineHeight: '38px',
      fontFamily: 'Manrope',
      fontStyle: 'normal',
      color: '#20232C',
    },
    transactionMessagesCard: {
      background: '#F6F9FC',
      borderRadius: '10px',
      boldText: {
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '19px',
        fontFamily: 'Manrope',
        fontStyle: 'normal',
      },
      text: {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '22px',
        fontFamily: 'Manrope',
        fontStyle: 'normal',
      },
      color: '#0176FF',
    },
  },
  black: '#20232C',
  white: '#FFFFFF',
};
// const breakpoints = {
//   values: {
//     xs: 320,
//     sm: 768,
//     md: 964,
//     lg: 964,
//     xl: 964,
//   },
// };
export const lightTheme = createMuiTheme({
  custom,
  shape: {
    borderRadius: 16,
  },
  palette: {
    background: {
      default: '#fff',
    },
  },
  typography,
  // breakpoints,
  overrides: {
    // MuiPickersToolbar: {
    //   toolbar: {
    //     backgroundColor: '#00C2FF',
    //   },
    // },
    // MuiPickersCalendarHeader: {
    //   switchHeader: {
    //     // backgroundColor: lightBlue.A200,
    //     // color: "white",
    //   },
    // },
    // MuiPickersDay: {
    //   daySelected: {
    //     backgroundColor: '#00C2FF',
    //   },
    //   dayDisabled: {
    //     color: lightBlue['100'],
    //   },
    //   current: {
    //     color: lightBlue['900'],
    //   },
    // },
    // MuiPickersClock: {
    //   pin: {
    //     backgroundColor: '#00C2FF',
    //   },
    // },
    // MuiPickersClockPointer: {
    //   thumb: {
    //     border: '14px solid #00C2FF',
    //   },
    //   noPoint: {
    //     backgroundColor: '#00C2FF',
    //   },
    //   pointer: {
    //     backgroundColor: '#00C2FF',
    //   },
    // },
    // MuiPickersModal: {
    //   dialogAction: {
    //     color: lightBlue['400'],
    //   },
    // },
  },
});
