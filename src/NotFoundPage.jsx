import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || 'The page you are looking for does not exist.';

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen p-4">
      <Typography variant="h4" className="text-gray-800 dark:text-gray-200 mb-4">
        404 - Not Found
      </Typography>
      <Typography className="text-gray-600 dark:text-gray-400 mb-6">
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2"
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFoundPage;