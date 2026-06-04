import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { Alert, Box, Button, Card, TextField, Typography, useTheme } from '@mui/material';

export const AuthPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    <Card
      elevation={0}
      sx={{
        borderRadius: '12px',
        bgcolor: 'background.paper',
        boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.35)',
        border: isLight ? 'none' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
        {isLogin ? 'TaskPlanet Login' : 'Create Account'}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: 14 }}>
        {isLogin
          ? 'Access your feed, publish updates, and join conversations.'
          : 'Create your profile and start posting with the community.'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {!isLogin && (
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 1.5,
            bgcolor: 'primary.main',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '12px',
            py: 1.2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#0069d9', boxShadow: 'none' },
          }}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
        <Button
          fullWidth
          variant="text"
          sx={{ textTransform: 'none', color: 'text.secondary', borderRadius: '12px' }}
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </Button>
      </Box>
    </Card>
  );
};
