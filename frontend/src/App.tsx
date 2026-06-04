import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { AuthPage } from './component/AuthPage';
import { SocialFeed } from './component/SocialFeed';
import { Box, AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';

const AppContent: React.FC = () => {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="text.secondary">Loading application state...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', pb: 6 }}>
      {/* TaskPlanet Inspired Header Navigation */}
      <AppBar position="static" sx={{ bgcolor: '#007bff', boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '0.5px' }}>
            TaskPlanet Social Feed
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* If user is not authenticated, present the Signup/Login module card panels */}
        {!auth?.user ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            <AuthPage />
            <Box sx={{ width: '100%', maxWidth: '500px' }}>
              <Typography variant="subtitle2" sx={{ textAlign: 'center', color: '#6c757d', mb: 2, fontWeight: 600 }}>
                — Public Feed View (Login to Post/Like/Comment) —
              </Typography>
              <SocialFeed />
            </Box>
          </Box>
        ) : (
          /* When authenticated, render the fully active interactive dashboard stream */
          <SocialFeed />
        )}
      </Container>
    </Box>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <AppContent />
    </AuthProvider>
  );
}