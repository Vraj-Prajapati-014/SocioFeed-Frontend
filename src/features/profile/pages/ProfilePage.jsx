import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useProfile } from '../hook/useProfile';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePosts from '../components/ProfilePosts';
import Spinner from '../../../components/common/Spinner/Spinner';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import useAuth from '../../auth/hooks/useAuth';
import { routeConstants } from '../../auth/constants/routeConstants';

const ProfilePage = () => {
  const { id } = useParams();
  console.log('Profile ID:', id);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: profile, isLoading, isError, error, refetch } = useProfile(id);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.ROUTE_LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const isOwnProfile = user?.id === profile?.id;

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
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onFollowChange={refetch} // Pass refetch to trigger cache invalidation
      />
      <ProfilePosts posts={profile?.posts} />
    </Box>
  );
};

export default ProfilePage;