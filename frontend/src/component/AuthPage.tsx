import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { Box, Card, TextField, Button, Typography, Alert, Container } from '@mui/material';

export const AuthPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const { data } = await API.post('/auth/login', { email, password });
        auth?.login(data);
      } else {
        const { data } = await API.post('/auth/signup', { username, email, password });
        auth?.login(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication operation failed.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ p: 4, width: '100%', borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#007bff' }}>
            {isLogin ? 'TaskPlanet Login' : 'Create Account'}
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                margin="normal" required fullWidth label="Username"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <TextField
              margin="normal" required fullWidth label="Email Address"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal" required fullWidth label="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit" fullWidth variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#007bff', fontWeight: 600, textTransform: 'none', borderRadius: 2 }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              fullWidth variant="text" sx={{ textTransform: 'none', color: '#6c757d' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};