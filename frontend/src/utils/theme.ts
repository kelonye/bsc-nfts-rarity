import { createTheme } from '@material-ui/core/styles';
import { BORDER_RADIUS } from 'config';

export default createTheme({
  typography: {
    fontFamily: ['Work Sans', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    type: 'dark',
    background: {
      default: 'rgb(30, 32, 38)',
      paper: 'rgb(20, 22, 28)',
    },
    primary: {
      main: 'rgb(248, 209, 47)',
    },
    secondary: {
      main: 'rgba(0, 0, 0, 0.5)', // rgb(9, 9, 47)
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: BORDER_RADIUS,
      },
    },
    // MuiInput: {
    //   underline: {
    //     '&:before': {
    //       borderBottomColor: '#313131',
    //     },
    //     '&:after': {
    //       borderBottomColor: '#313131',
    //     },
    //   },
    // },
  },
});
