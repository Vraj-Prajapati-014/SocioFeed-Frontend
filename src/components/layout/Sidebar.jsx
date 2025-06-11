import React, { useContext } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../features/auth/slices/authSlice';
import { routeConstants } from '../../features/auth/constants/routeConstants';
import useAuth from '../../features/auth/hooks/useAuth';
import { Home, Search, Person, Add, Bookmark, Notifications, Logout } from '@mui/icons-material';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import ThemeContext from '../../utils/context/ThemeContext';

const Sidebar = ({ onNavClick }) => {
  const { user, isAuthenticated } = useAuth();
  const username = user?.username;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.ROUTE_LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate(routeConstants.ROUTE_LOGIN, { replace: true });
    if (onNavClick) onNavClick();
  };

  const handleSocioFeedClick = () => {
    navigate(routeConstants.ROUTE_DASHBOARD);
    if (onNavClick) onNavClick();
  };

  const navItems = [
    { text: 'Home', icon: <Home />, path: routeConstants.ROUTE_DASHBOARD },
    { text: 'Search', icon: <Search />, path: routeConstants.ROUTE_SEARCH },
    {
      text: 'Profile',
      icon: <Person />,
      path: `/profile/${user?.id}`,
      state: { username },
    },
    { text: 'Create', icon: <Add />, path: '/create' },
    { text: 'Saved', icon: <Bookmark />, path: '/saved' },
  ];

  const moreItems = [
    { text: 'Activity', icon: <Notifications />, path: '/activity' },
    { text: 'Logout', icon: <Logout />, path: '#', onClick: handleLogout },
  ];

  const isDark = theme === 'dark';

  return (
    <div
      className={`h-screen p-4 border-r sticky top-0 flex flex-col ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold cursor-pointer ${isDark ? 'text-white' : 'text-black'}`}
          onClick={handleSocioFeedClick}
        >
          SocioFeed
        </h1>
      </div>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            state={item.state}
            onClick={onNavClick}
            className={`mb-2 rounded-lg ${
              location.pathname === item.path ? (isDark ? 'bg-gray-700' : 'bg-gray-100') : ''
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ className: isDark ? 'text-gray-300' : 'text-gray-900' }}
            />
          </ListItem>
        ))}
      </List>
      <div className="mt-auto">
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
          {moreItems.map((item) => (
            <ListItem
              key={item.text}
              component={item.onClick ? 'button' : Link}
              to={item.onClick ? undefined : item.path}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
                if (onNavClick) onNavClick();
              }}
              className={`mb-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ className: isDark ? 'text-gray-300' : 'text-gray-900' }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Sidebar;