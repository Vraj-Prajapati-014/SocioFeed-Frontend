import React from 'react';
import { Box, Typography } from '@mui/material';

const PlaceholderPage = ({ title }) => {
  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Typography variant="h5" color="text.secondary">
        {title} - Coming Soon
      </Typography>
    </Box>
  );
};

export default PlaceholderPage;