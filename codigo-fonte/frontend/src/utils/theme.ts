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
            borderColor: '#1E4EC4',
          },
          '&.Mui-focused:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline:not(.Mui-disabled)': {
            borderColor: '#1E4EC4',
            borderWidth: 2,
          },
        },
        input: {
          color: '#000000',
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #fcfcfc inset',
            WebkitTextFillColor: '#000000',
          },
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
          '&:hover': {
            color: '#1E4EC4',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 15,
          backgroundColor: '#21AD53',
          color: '#FFFFFF',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            transform: 'scale(1.02)'
          }
        },
      },
    },
  },
});

export default theme;
