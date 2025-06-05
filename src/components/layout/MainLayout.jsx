import React, { useState, useContext } from 'react';
import { Box, IconButton, Drawer } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import MessagingSidebar from './MessagingSidebar';
import ThemeContext from '../../utils/context/ThemeContext';

const MainLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Sidebar (Desktop) */}
      <Box component="nav" className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </Box>

      {/* Mobile Drawer */}
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

      {/* Main Content */}
      <Box
        component="main"
        className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' }, mb: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box className="max-w-3xl mx-auto">{children}</Box>
      </Box>

      {/* Messaging Sidebar (Desktop) */}
      <Box
        component="aside"
        className="hidden lg:block w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700"
      >
        <MessagingSidebar />
      </Box>
    </Box>
  );
};

export default MainLayout;