import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useFollow } from '../hook/useFollow';
import { routeConstants } from '../../auth/constants/routeConstants';

const ProfileHeader = ({ profile, isOwnProfile, onFollowChange }) => {
  const navigate = useNavigate();
  const { follow, unfollow, isFollowingLoading } = useFollow(profile?.id);

  const handleFollowToggle = async () => {
    try {
      if (profile.isFollowing) {
        await unfollow(profile.id);
      } else {
        await follow(profile.id);
      }
      if (onFollowChange) {
        await onFollowChange();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleFollowersClick = () => {
    navigate(`/profile/${profile.id}/followers`, { state: { username: profile.username } });
  };

  const handleFollowingClick = () => {
    navigate(`/profile/${profile.id}/following`, { state: { username: profile.username } });
  };

  return (
    <Box className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4 border-b border-gray-200 dark:border-gray-700">
      <Avatar
        src={profile?.avatarUrl || '/default-avatar.png'}
        alt={profile?.username}
        className="w-24 h-24 md:w-32 md:h-32 border-2 border-gray-300 dark:border-gray-600"
      />
      <Box className="flex-1">
        <Box className="flex items-center justify-between mb-2">
          <Typography variant="h5" className="font-semibold text-gray-900 dark:text-gray-100">
            {profile?.username}
          </Typography>
          {isOwnProfile ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(routeConstants.ROUTE_EDIT_PROFILE)}
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={profile?.isFollowing ? 'outlined' : 'contained'}
              size="small"
              onClick={handleFollowToggle}
              disabled={isFollowingLoading}
              className={
                profile?.isFollowing
                  ? 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            >
              {isFollowingLoading ? 'Loading...' : profile?.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Box>
        <Box className="flex gap-6 mb-4">
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
        <Typography className="text-gray-800 dark:text-gray-200">
          {profile?.bio || 'No bio yet.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileHeader;