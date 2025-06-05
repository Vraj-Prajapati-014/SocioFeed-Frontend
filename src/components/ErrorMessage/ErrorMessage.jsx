import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ErrorMessage = ({ error, onRetry, className = '' }) => {
  const errorMessage =
    typeof error === 'string' ? error : error?.message || 'Something went wrong. Please try again.';

  return (
    <Box className={`text-center my-4 ${className}`}>
      <Typography color="error" className="mb-2">
        {errorMessage}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorMessage;