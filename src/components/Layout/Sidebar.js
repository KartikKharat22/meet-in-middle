
import React from 'react';
import {
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
  Avatar, 
  Typography
} from '@mui/material';
import {
  Dashboard,
  Groups,
  CalendarMonth,
  LocationOn,
  Settings,
  Logout,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const sidebarItems = [
  {
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard'
  },
  {
    label: 'Meetings',
    icon: <CalendarMonth />,
    path: '/meetings'
  },
  {
    label: 'Contacts',
    icon: <Groups />,
    path: '/contacts'
  },
  {
    label: 'Locations',
    icon: <LocationOn />,
    path: '/locations'
  },
  {
    type: 'divider'
  },
  {
    label: 'Settings',
    icon: <Settings />,
    path: '/settings'
  }
];

function Sidebar({ mobileOpen, handleDrawerToggle, drawerWidth = 240 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  
  const user = {
    name: 'John Doe',
    avatar: ''
  };

  const drawerContent = (
    <Box>
  
      <Toolbar sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar 
          src={user.avatar} 
          sx={{ width: 40, height: 40, mr: 2 }}
        >
          {user.name.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" noWrap>
          {user.name}
        </Typography>
      </Toolbar>
      <Divider />

  
      <List>
        {sidebarItems.map((item, index) => (
          <React.Fragment key={item.label || `divider-${index}`}>
            {item.type === 'divider' ? (
              <Divider sx={{ my: 1 }} />
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname.startsWith(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>

    
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItemButton>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 }
      }}
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true 
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;