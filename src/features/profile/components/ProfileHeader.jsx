import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar } from '@mui/material';
import Button from '../../../components/common/Button/Button';
import FollowButton from './FollowButton';
import MessageButton from '../../messages/components/MessageButton';
import { useFollow } from '../hook/useFollow';
import { fetchProfile } from '../services/profileService';
import { routeConstants } from '../../auth/constants/routeConstants';

const ProfileHeader = ({ profile, isOwnProfile, onProfileUpdate, hideButtons = false }) => {
  const navigate = useNavigate();
  const { follow, unfollow } = useFollow();
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(profile?.isFollowing || false);

  // Sync local isFollowing state when profile prop changes
  useEffect(() => {
    setIsFollowing(profile?.isFollowing || false);
  }, [profile?.isFollowing]);

  const handleFollowToggle = async () => {
    try {
      setIsLoading(true);
      // Optimistically update the follow state
      setIsFollowing(prev => !prev);

      const refreshProfile = async () => {
        const updatedProfile = await fetchProfile(profile.id);
        console.log('Fetched updated profile:', updatedProfile);
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
      };

      if (isFollowing) {
        await unfollow(profile.id, refreshProfile);
      } else {
        await follow(profile.id, refreshProfile);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      // Revert optimistic update on error
      setIsFollowing(prev => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowersClick = () => {
    navigate(`/profile/${profile.id}/followers`, { state: { username: profile.username } });
  };

  const handleFollowingClick = () => {
    navigate(`/profile/${profile.id}/following`, { state: { username: profile.username } });
  };

  return (
    <Box className="flex flex-col md:flex-row items-start gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
      <Avatar
        src={profile?.avatarUrl || '/default-avatar.png'}
        alt={profile?.username}
        className="w-20 h-20 md:w-24 md:h-24 border-2 border-gray-300 dark:border-gray-600"
      />
      <Box className="flex-1">
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <Typography variant="h6" className="font-semibold text-gray-900 dark:text-gray-100">
            {profile?.username}
          </Typography>
          {!hideButtons && (
            <Box className="flex items-center gap-2">
              {isOwnProfile ? (
                <Button
                  onClick={() => navigate(routeConstants.ROUTE_EDIT_PROFILE)}
                  size="small"
                  className="px-4 py-1 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all duration-200 shadow-sm"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <FollowButton
                    userId={profile.id}
                    isFollowing={isFollowing}
                    followsYou={false}
                    onFollowChange={handleFollowToggle}
                    isLoading={isLoading}
                  />
                  {isFollowing !== null && (
                    <MessageButton
                      userId={profile.id}
                      username={profile.username}
                      disabled={!isFollowing}
                    />
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
        <Box className="flex gap-4 sm:gap-6 mb-3">
          <Typography
            className="text-gray-700 dark:text-gray-300 cursor-pointer"
            onClick={handleFollowersClick}
          >
            <strong>{profile?.followersCount || 0}</strong> followers
          </Typography>
          <Typography
            className="text-gray-700 dark:text-gray-300 cursor-pointer"
            onClick={handleFollowingClick}
          >
            <strong>{profile?.followingCount || 0}</strong> following
          </Typography>
          <Typography className="text-gray-700 dark:text-gray-300">
            <strong>{profile?.postsCount || 0}</strong> posts
          </Typography>
        </Box>
        <Typography
          className="text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: profile?.bio || 'No bio yet.' }}
        />
      </Box>
    </Box>
  );
};

export default ProfileHeader;