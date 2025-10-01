import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6699ff',
    },
    secondary: {
      main: '#ff66b2',
    },
    background: {
      default: '#1a1a1d',
      paper: 'rgba(44, 44, 49, 0.85)', // Semi-transparent paper for the gradient to show
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background: linear-gradient(135deg, #2c3e50 0%, #0072ff 50%, #e74c3c 100%);
          background-attachment: fixed;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(44, 44, 49, 0.85)',
                backdropFilter: 'blur(10px)',
            },
        },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '24px',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        },
      },
    },
  },
});

export default theme;