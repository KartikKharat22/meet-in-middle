// src/components/Layout/Header.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Search,
  AccountCircle,
  Logout,
  Settings,
  Dashboard,
  MoreVert
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';



const navItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Meetings', path: '/meetings' },
  { label: 'Contacts', path: '/contacts' },
];

const userMenuItems = [
  { label: 'Profile', icon: <AccountCircle />, path: '/profile' },
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
  { label: 'Logout', icon: <Logout />, action: 'logout' },
];

function Header({ onDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  
  const user = {
    name: 'John Doe',
    avatar: '',
    notifications: 3
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMenuItemClick = (item) => {
    handleMenuClose();
    if (item.action === 'logout') {
      
      console.log('Logout clicked');
      navigate(item.path);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderNavItems = () => (
    navItems.map((item) => (
      <Button
        key={item.label}
        component={Link}
        to={item.path}
        color="inherit"
        sx={{ mx: 1 }}
      >
        {item.label}
      </Button>
    ))
  );

  const renderUserMenu = () => (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userMenuItems.map((item, index) => (
        <MenuItem 
          key={index} 
          onClick={() => handleMenuItemClick(item)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1 }}>{item.icon}</Box>
            {item.label}
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );

  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={user.notifications} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

      
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          Meet in the Middle
        </Typography>

        
        {!isMobile && (
          <Box sx={{ display: 'flex' }}>
            {renderNavItems()}
          </Box>
        )}

      
        {!isMobile && (
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Search />
          </IconButton>
        )}

        
        <IconButton color="inherit">
          <Badge badgeContent={user.notifications} color="error">
            <Notifications />
          </Badge>
        </IconButton>

    
        <IconButton
          edge="end"
          onClick={handleProfileMenuOpen}
          color="inherit"
          sx={{ ml: 1 }}
        >
          <Avatar 
            src={user.avatar} 
            sx={{ width: 32, height: 32 }}
          >
            {user.name.charAt(0)}
          </Avatar>
        </IconButton>

        
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={(e) => setMobileMoreAnchorEl(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        )}
      </Toolbar>

  
      {renderUserMenu()}
      {isMobile && renderMobileMenu()}
    </AppBar>
  );
}

export default Header;