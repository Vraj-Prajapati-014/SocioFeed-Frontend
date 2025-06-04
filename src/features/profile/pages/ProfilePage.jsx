import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routeConstants } from '../../auth/constants/routeConstants';
import { Box } from '@mui/material';
import { useProfile } from '../hook/useProfile';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePosts from '../components/ProfilePosts';
import Spinner from '../../../components/common/Spinner/Spinner';
import useAuth from '../../auth/hooks/useAuth'; // Assuming you have a useAuth hook

const ProfilePage = () => {
  const currentUser = useParams(); // Get current user from auth context
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Use useAuth hook
  const username = user?.username;

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const { data: profile, isLoading, error } = useProfile(username);
  console.log('Profile data:', profile);

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </Box>
    );
  }

  const isOwnProfile = currentUser?.username === username;

  return (
    <Box className="max-w-3xl mx-auto py-6">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <ProfilePosts posts={profile?.posts} />
    </Box>
  );
};

export default ProfilePage;
