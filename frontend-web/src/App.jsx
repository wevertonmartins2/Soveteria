import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './routes';
import theme from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header /> {/* Add Header component here */}
          <AppRoutes />
          {/* TODO: Add Footer component here */}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
