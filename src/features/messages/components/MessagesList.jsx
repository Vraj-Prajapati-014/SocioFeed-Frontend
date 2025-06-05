import React from 'react';
import { Box, Typography } from '@mui/material';

const MessagesList = () => {
  return (
    <Box className="p-4">
      <Typography variant="h6">Messages</Typography>
      <Typography className="text-gray-500 dark:text-gray-400">
        Messaging feature coming soon.
      </Typography>
    </Box>
  );
};

export default MessagesList;