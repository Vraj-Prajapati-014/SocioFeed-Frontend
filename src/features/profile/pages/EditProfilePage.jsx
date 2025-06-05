import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { useProfile } from '../hook/useProfile';
import EditProfileForm from '../components/EditProfileForm';
import AvatarUpload from '../components/AvatarUpload';
import Spinner from '../../../components/common/Spinner/Spinner';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import useAuth from '../../auth/hooks/useAuth';
import { routeConstants } from '../../auth/constants/routeConstants';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: profile, isLoading, isError, error, refetch } = useProfile(user?.id); // Changed to userId

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Spinner />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <ErrorMessage error={error} onRetry={refetch} />
      </Box>
    );
  }

  return (
    <Box className="max-w-3xl mx-auto py-6">
      <Box className="mb-6">
        <Button
          variant="outlined"
          onClick={() => navigate(`/profile/${user?.id}`, { state: { username: user?.username } })} // Changed to userId
          className="mb-4"
        >
          Back to Profile
        </Button>
        <EditProfileForm
          profile={profile}
          onSuccess={() => navigate(`/profile/${user?.id}`, { state: { username: user?.username } })} // Changed to userId
        />
      </Box>
      <Box>
        <AvatarUpload
          userId={user?.id} // Pass userId
          onSuccess={() => navigate(`/profile/${user?.id}`, { state: { username: user?.username } })} // Changed to userId
        />
      </Box>
    </Box>
  );
};

export default EditProfilePage;