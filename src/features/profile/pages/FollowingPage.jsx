import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import FollowingList from '../components/FollowingList';

const FollowingPage = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const username = location.state?.username; 

  if (!username) {
    return <Box className="max-w-3xl mx-auto py-6">Username not found.</Box>;
  }

  return (
    <Box className="max-w-3xl mx-auto py-6">
      <FollowingList userId={id} username={username} />
    </Box>
  );
};

export default FollowingPage;