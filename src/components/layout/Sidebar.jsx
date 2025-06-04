import React, { useContext } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../features/auth/slices/authSlice'; // Import logout action
import { routeConstants } from '../../features/auth/constants/routeConstants';
import useAuth from '../../features/auth/hooks/useAuth';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ProfileIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Add';
import SavedIcon from '@mui/icons-material/Bookmark';
import ActivityIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import ThemeContext from '../../utils/context/ThemeContext';

const Sidebar = () => {
  const { user, isAuthenticated } = useAuth(); // Use useAuth hook
  const username = user?.username;
  const navigate = useNavigate();
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.LOGIN);
    }
  }, [isAuthenticated, navigate]);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate(routeConstants.ROUTE_LOGIN, { replace: true });
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: routeConstants.ROUTE_HOME },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { text: 'Profile', icon: <ProfileIcon />, path: `/profile/${username}` }, // Adjusted path
    { text: 'Create', icon: <CreateIcon />, path: '/create' },
    { text: 'Saved', icon: <SavedIcon />, path: '/saved' },
  ];

  const moreItems = [
    { text: 'Activity', icon: <ActivityIcon />, path: '/activity' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/logout', onClick: handleLogout }, // Added onClick
  ];

  const isDark = theme === 'dark';

  return (
    <Box
      className={`h-screen p-4 border-r sticky top-0 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } flex flex-col`}
    >
      {/* Logo / App Name */}
      <Box className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>SocioFeed</h1>
      </Box>

      {/* Navigation Items */}
      <List>
        {navItems.map(item => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            className={`mb-2 rounded-lg ${
              location.pathname === item.path ? (isDark ? 'bg-gray-700' : 'bg-gray-100') : ''
            }`}
          >
            <ListItemIcon className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                className: isDark ? 'text-gray-300' : 'text-gray-900',
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* More Section (bottom) */}
      <Box className="mt-auto">
        <List>
          <ListItem>
            <ListItemText
              primary="More"
              primaryTypographyProps={{
                className: `text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`,
              }}
            />
          </ListItem>

          <ListItem>
            <ThemeToggle />
          </ListItem>

          {moreItems.map(item => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={item.onClick || (() => {})} // Handle logout click
              className="mb-2 rounded-lg"
            >
              <ListItemIcon className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  className: isDark ? 'text-gray-300' : 'text-gray-900',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
