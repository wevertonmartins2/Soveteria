import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color (blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (pink)
    },
    background: {
      default: '#f4f6f8', // Light grey background
      paper: '#ffffff', // White background for paper elements
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    // Add other typography variants as needed
  },
  components: {
    // Example: Customize Button component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase transformation
          borderRadius: 8, // Slightly rounded corners
        },
      },
    },
    // Add other component customizations as needed
  },
});

export default theme;
