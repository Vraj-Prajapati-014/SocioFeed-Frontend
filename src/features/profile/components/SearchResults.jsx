import React, { useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import FollowButton from './FollowButton';
import { useFollow } from '../hook/useFollow';

// Helper function to detect if a string contains HTML tags
const containsHTML = (str) => /<[a-z][\s\S]*>/i.test(str);

const SearchResults = ({ data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch }) => {
  const navigate = useNavigate();
  const { follow, unfollow } = useFollow();
  const users = data?.pages?.flatMap(page => page.users) || [];
  const [loadingStates, setLoadingStates] = useState({});
  const [followError, setFollowError] = useState(null); // Track follow/unfollow errors

  const handleFollowToggle = (userId, isFollowing) => async () => {
    try {
      console.log('handleFollowToggle called:', { userId, isFollowing });
      setLoadingStates(prev => ({ ...prev, [userId]: true }));
      setFollowError(null); // Clear any previous errors
      if (isFollowing) {
        await unfollow(userId);
      } else {
        await follow(userId);
      }
      await refetch();
    } catch (error) {
      console.error('Error toggling follow in search results:', error);
      setFollowError('Failed to update follow status. Please try again.');
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
      {followError && (
        <ErrorMessage
          error={followError}
          onRetry={() => handleFollowToggle(user.id, user.isFollowing)()}
        />
      )}
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
                <Box>
                  <Typography>{user.username}</Typography>
                  {user.bio ? (
                    containsHTML(user.bio) ? (
                      <Typography variant="body2" color="textSecondary">
                        <div
                          className="MuiTypography-body2"
                          style={{ color: 'inherit' }}
                          dangerouslySetInnerHTML={{ __html: user.bio }}
                        />
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        {user.bio}
                      </Typography>
                    )
                  ) : null}
                </Box>
              </Box>
              {user.isFollowing !== null && (
                <FollowButton
                  userId={user.id}
                  username={user.username}
                  isFollowing={user.isFollowing}
                  followsYou={user.followsYou}
                  onFollowChange={handleFollowToggle(user.id, user.isFollowing)}
                  isLoading={loadingStates[user.id] || false}
                  showMessageButton={true}
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