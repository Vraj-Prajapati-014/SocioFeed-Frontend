import React, { useState, useContext, useEffect } from 'react';
import { Box, IconButton, Drawer } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import MessagingSidebar from './MessagingSidebar';
import ThemeContext from '../../utils/context/ThemeContext';

const MainLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMessagingToggle = () => {
    setMessagingOpen(!messagingOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMessagingOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDark = theme === 'dark';

  return (
    <Box className={`flex flex-row min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <Box component="nav" className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Sidebar onNavClick={handleDrawerToggle} />
      </Drawer>

      <Box
        component="main"
        className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
      >
        <Box className="flex justify-between items-center mb-4 md:hidden">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open messaging"
            edge="end"
            onClick={handleMessagingToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box className="max-w-4xl mx-auto">{children}</Box>
      </Box>

      <Box
        component="aside"
        className="hidden lg:block w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 z-10"
      >
        <MessagingSidebar />
      </Box>


      <Drawer
        variant="temporary"
        anchor="right"
        open={messagingOpen}
        onClose={handleMessagingToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
        }}
      >
        <MessagingSidebar onNavClick={handleMessagingToggle} />
      </Drawer>
    </Box>
  );
};

export default MainLayout;