import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { NotificationProvider } from './context/NotificationContext';
import NotificationList from './pages/NotificationList';
import { initAuth } from './services/authService';
import { Log } from './logger';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#a855f7' },
    background: { default: '#0f0f23', paper: '#1a1a3e' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    initAuth()
      .then(() => {
        Log('frontend', 'info', 'page', 'application initialized and authenticated');
        setReady(true);
      })
      .catch((err) => {
        console.error('Auth error:', err);
        setAuthError(String(err));
      });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {!ready && !authError && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={2}
          sx={{ background: 'linear-gradient(135deg,#0f0f23,#1a1a3e)' }}
        >
          <CircularProgress sx={{ color: '#6366f1' }} size={52} />
          <Typography color="text.secondary" variant="body1">
            Initializing…
          </Typography>
        </Box>
      )}
      {authError && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          sx={{ background: '#0f0f23' }}
        >
          <Typography color="error">Auth failed: {authError}</Typography>
        </Box>
      )}
      {ready && (
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<NotificationList />} />
              <Route path="/notifications" element={<NotificationList />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      )}
    </ThemeProvider>
  );
};

export default App;
