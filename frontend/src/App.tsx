import React, { useContext, useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Snackbar,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  createTheme,
} from '@mui/material';
import type { SlideProps } from '@mui/material/Slide';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { AuthPage } from './component/AuthPage';
import { SocialFeed } from './component/SocialFeed';

const SlideUpTransition = (props: SlideProps) => <Slide {...props} direction="up" />;

const navItems = [
  { label: 'Feed', icon: <HomeRoundedIcon />, isPlaceholder: false },
  { label: 'Explore', icon: <TravelExploreRoundedIcon />, isPlaceholder: true },
  { label: 'Notifications', icon: <NotificationsNoneRoundedIcon />, isPlaceholder: true },
  { label: 'Direct Messages', icon: <ForumRoundedIcon />, isPlaceholder: true },
  { label: 'Settings', icon: <SettingsRoundedIcon />, isPlaceholder: true },
];

const trends = [
  { tag: '#WebDev', subtitle: '2,341 developers are posting about modern UI work.' },
  { tag: '#MERNStack', subtitle: 'Fresh discussions on scalable app architecture.' },
  { tag: '#TypeScript', subtitle: 'Strong typing patterns trending across project teams.' },
];

interface AppContentProps {
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ mode, onToggleMode }) => {
  const auth = useContext(AuthContext);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (auth?.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="text.secondary">
          Loading application state...
        </Typography>
      </Box>
    );
  }

  const shellCardSx = {
    borderRadius: '12px',
    bgcolor: 'background.paper',
    boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.35)',
    border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : 'none',
  };

  const handlePlaceholderClick = (tabName: string) => {
    setToastMessage(`${tabName} feature coming soon!`);
    setIsToastOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: '#ffffff',
          boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.35)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 72, sm: 80 }, gap: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              minWidth: { md: 220 },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            TaskPlanet
          </Typography>

          <Box
            sx={{
              flex: 1,
              maxWidth: 540,
              mx: { xs: 0, md: 'auto' },
              px: 1.5,
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderRadius: '999px',
              bgcolor: 'rgba(255,255,255,0.16)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <SearchIcon sx={{ color: 'rgba(255,255,255,0.9)' }} />
            <InputBase
              placeholder="Search people, posts, and tasks"
              sx={{
                color: '#ffffff',
                flex: 1,
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.78)',
                  opacity: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <IconButton sx={{ color: '#ffffff' }} onClick={onToggleMode}>
                {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
              </IconButton>
            </Tooltip>
            <IconButton
              sx={{ color: '#ffffff' }}
              onClick={() => handlePlaceholderClick('Notifications')}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>
            <IconButton
              sx={{ color: '#ffffff', display: { xs: 'none', sm: 'inline-flex' } }}
              onClick={() => handlePlaceholderClick('Direct Messages')}
            >
              <Badge badgeContent={2} color="error">
                <MailOutlineRoundedIcon />
              </Badge>
            </IconButton>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#ffffff',
                color: 'primary.main',
                fontWeight: 700,
              }}
            >
              {(auth?.user?.username || 'a')[0].toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3 }, pt: { xs: 12, sm: 14 }, pb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 112 }}>
              <Card sx={shellCardSx}>
                <Box
                  sx={{
                    height: 92,
                    background:
                      mode === 'light'
                        ? 'linear-gradient(135deg, #60a5fa 0%, #007bff 55%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 48%, #0f172a 100%)',
                  }}
                />
                <CardContent sx={{ pt: 0, mt: -4 }}>
                  <Avatar
                    sx={{
                      width: 88,
                      height: 88,
                      mx: 'auto',
                      mb: 1.5,
                      border: '4px solid',
                      borderColor: 'background.paper',
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      fontWeight: 700,
                    }}
                  >
                    A
                  </Avatar>
                  <Typography variant="h6" align="center" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {auth?.user?.username || 'aahan'}
                  </Typography>
                  <Typography align="center" sx={{ color: 'text.secondary', fontSize: 14, mb: 2.5 }}>
                    Building tasks, sharing wins, and staying in the loop.
                  </Typography>
                  <Divider sx={{ mb: 1.5, borderColor: 'divider' }} />
                  <List disablePadding>
                    {navItems.map((item) => (
                      <ListItemButton
                        key={item.label}
                        onClick={item.isPlaceholder ? () => handlePlaceholderClick(item.label) : undefined}
                        sx={{
                          borderRadius: '12px',
                          mb: 0.5,
                          py: 1.1,
                          '&:hover': { bgcolor: alpha('#007bff', mode === 'light' ? 0.07 : 0.14) },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{item.icon}</ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          sx={{ '& .MuiTypography-root': { fontWeight: 600, color: 'text.primary', fontSize: 15 } }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {!auth?.user ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ px: { xs: 0.5, sm: 0 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    Join the TaskPlanet community
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                    Sign in to publish updates, react to posts, and jump into conversations with your team.
                  </Typography>
                  <AuthPage />
                </Box>
                <SocialFeed />
              </Box>
            ) : (
              <SocialFeed />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 112, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card sx={shellCardSx}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TrendingUpRoundedIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Trending Tasks
                    </Typography>
                  </Box>
                  <List disablePadding>
                    {trends.map((trend, index) => (
                      <Box key={trend.tag}>
                        {index > 0 && <Divider sx={{ borderColor: 'divider' }} />}
                        <Box sx={{ py: 1.75 }}>
                          <Typography sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>{trend.tag}</Typography>
                          <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.45 }}>
                            {trend.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </List>
                </CardContent>
              </Card>

              <Card sx={shellCardSx}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                    Who to Follow
                  </Typography>
                  {[
                    { name: 'Priya Sharma', handle: '@priya.codes' },
                    { name: 'Dev Nexus', handle: '@devnexus' },
                    { name: 'Frontend Guild', handle: '@frontendguild' },
                  ].map((profile, index) => (
                    <Box key={profile.handle}>
                      {index > 0 && <Divider sx={{ borderColor: 'divider' }} />}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha('#007bff', mode === 'light' ? 0.1 : 0.18), color: 'primary.main' }}>
                          {profile.name[0]}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{profile.name}</Typography>
                          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{profile.handle}</Typography>
                        </Box>
                        <IconButton
                          size="small"
                          sx={{
                            ml: 'auto',
                            color: 'primary.main',
                            bgcolor: alpha('#007bff', mode === 'light' ? 0.08 : 0.16),
                            '&:hover': { bgcolor: alpha('#007bff', mode === 'light' ? 0.14 : 0.24) },
                          }}
                        >
                          <AlternateEmailRoundedIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={isToastOpen}
        autoHideDuration={3000}
        onClose={() => setIsToastOpen(false)}
        message={toastMessage}
        slots={{ transition: SlideUpTransition }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('taskplanet_theme_mode');
    return savedMode === 'dark' ? 'dark' : 'light';
  });

  const theme = createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'light' ? '#f4f6f8' : '#111827',
        paper: mode === 'light' ? '#ffffff' : '#1f2937',
      },
      primary: {
        main: '#007bff',
      },
      text: {
        primary: mode === 'light' ? '#1f2937' : '#f9fafb',
        secondary: mode === 'light' ? '#65676b' : '#cbd5e1',
      },
      divider: mode === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'light' ? '#f4f6f8' : '#111827',
          },
          '#root': {
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            border: 'none',
            textAlign: 'left',
            minHeight: '100vh',
          },
        },
      },
    },
  });

  const toggleMode = () => {
    setMode((prev) => {
      const nextMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('taskplanet_theme_mode', nextMode);
      return nextMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        <AppContent mode={mode} onToggleMode={toggleMode} />
      </AuthProvider>
    </ThemeProvider>
  );
}
