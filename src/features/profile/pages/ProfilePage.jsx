import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { fetchProfile } from '../services/profileService';
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
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the initial profile data
  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await fetchProfile(id);
      console.log('Initial profile data:', profileData);
      setProfile(profileData);
      setIsError(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.ROUTE_LOGIN);
    } else {
      loadProfile();
    }
  }, [isAuthenticated, navigate, id]);

  const handleProfileUpdate = (updatedProfile) => {
    console.log('Updating profile state:', updatedProfile);
    setProfile(updatedProfile); // Update the profile state with the new data
  };

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
        <ErrorMessage error={error} onRetry={loadProfile} />
      </Box>
    );
  }

  return (
    <Box className="max-w-3xl mx-auto py-6">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={handleProfileUpdate}
      />
      <ProfilePosts posts={profile?.posts} />
    </Box>
  );
};

export default ProfilePage;