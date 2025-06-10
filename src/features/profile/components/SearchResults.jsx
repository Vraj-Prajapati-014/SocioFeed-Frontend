import React, { useState } from 'react'; // Add useState for isLoading
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import FollowButton from './FollowButton';
import { useFollow } from '../hook/useFollow'; // Import useFollow

const SearchResults = ({ data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch }) => {
  const navigate = useNavigate();
  const { follow, unfollow } = useFollow();
  const users = data?.pages?.flatMap(page => page.users) || [];
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state per user

  const handleFollowToggle = (userId, isFollowing) => async () => {
    try {
      setLoadingStates(prev => ({ ...prev, [userId]: true }));
      if (isFollowing) {
        await unfollow(userId);
      } else {
        await follow(userId);
      }
      // Refetch the search results to update isFollowing and followsYou
      await refetch();
    } catch (error) {
      console.error('Error toggling follow in search results:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading) {
    return <SkeletonLoader type="list" count={3} />;
  }

  if (isError) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Search Results</Typography>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<SkeletonLoader type="list" />}
        endMessage="No more users to show"
      >
        {users.length > 0 ? (
          users.map(user => (
            <Box key={user.id} className="flex items-center justify-between p-2">
              <Box
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/profile/${user.id}`, { state: { username: user.username } })}
              >
                <Avatar
                  src={user.avatarUrl || '/default-avatar.png'}
                  alt={user.username}
                  className="w-10 h-10 mr-3"
                />
                <Typography>{user.username}</Typography>
              </Box>
              {user.isFollowing !== null && (
                <FollowButton
                  userId={user.id}
                  username={user.username} // Pass username for Message button navigation
                  isFollowing={user.isFollowing}
                  followsYou={user.followsYou}
                  onFollowChange={handleFollowToggle(user.id, user.isFollowing)}
                  isLoading={loadingStates[user.id] || false}
                  showMessageButton={true} // Enable Message button behavior in SearchResults
                />
              )}
            </Box>
          ))
        ) : (
          <Typography className="text-gray-500 dark:text-gray-400">No users found.</Typography>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default SearchResults;