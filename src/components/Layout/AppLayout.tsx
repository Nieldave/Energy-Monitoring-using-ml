import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, Divider, IconButton, Badge } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Mic as MicIcon } from '@mui/icons-material';
import { RootState } from '../../store';
import { loadUser } from '../../store/actions/authActions';
import { fetchAlerts } from '../../store/actions/alertActions';
import Sidebar from './Sidebar';
import websocketService from '../../utils/websocket';
import voiceCommandService from '../../utils/voiceCommands';

const drawerWidth = 240;

const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.alerts);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(loadUser() as any);
      dispatch(fetchAlerts() as any);
      websocketService.connect();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [isAuthenticated, dispatch, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      voiceCommandService.stopListening();
      setIsListening(false);
    } else {
      const started = voiceCommandService.startListening();
      setIsListening(started);
    }
  };

  const handleNotificationsClick = () => {
    navigate('/alerts');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#1976d2',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Energy Monitoring Dashboard
          </Typography>
          {voiceCommandService.isSupported() && (
            <IconButton 
              color="inherit" 
              onClick={handleVoiceCommand}
              sx={{ 
                mr: 2,
                bgcolor: isListening ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
              }}
            >
              <MicIcon />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;