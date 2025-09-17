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
            backgroundColor: '#1a9446',
            transform: 'scale(1.02)',
          },
          '&:disabled': {
            backgroundColor: '#BEEBD0',
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});

export default theme;
