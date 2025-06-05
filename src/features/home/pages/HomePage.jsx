import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import useAuth from '../../auth/hooks/useAuth';
import HomeContent from '../components/HomeContent';
import { routeConstants } from '../../auth/constants/routeConstants';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // const username = user?.username;

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box>
      <HomeContent />
    </Box>
  );
};

export default HomePage;