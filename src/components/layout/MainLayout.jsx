import React, { useContext } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import MessagingSidebar from './MessagingSidebar';
import ThemeContext from '../../utils/context/ThemeContext';

const MainLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Box
      className={`flex min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      {/* Sidebar (Left) */}
      <Box component="nav" className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </Box>

      {/* Main Content (Center) */}
      <Box
        component="main"
        className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`}
      >
        <Box className="max-w-3xl mx-auto">{children}</Box>
      </Box>

      {/* Messaging Sidebar (Right) */}
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
