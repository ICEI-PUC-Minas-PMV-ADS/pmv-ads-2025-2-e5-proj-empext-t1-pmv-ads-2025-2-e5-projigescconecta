// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E4EC4', // azul institucional claro
      dark: '#264197', // azul institucional escuro
    },
    success: {
      main: '#21AD53', // verde ação
    },
    background: {
      default: '#fcfcfc', // quase branco
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#656d77', // cinza escuro
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#fcfcfc',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#264197',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1E4EC4',
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: '#666f77',
        },
        input: {
          color: '#000000',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#656d77',
          '&.Mui-focused': {
            color: '#1E4EC4',
          },
        },
      },
    },
  },
});

export default theme;
