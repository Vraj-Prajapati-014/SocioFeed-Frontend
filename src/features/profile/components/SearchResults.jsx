import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import FollowButton from './FollowButton';

const SearchResults = ({ data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch }) => {
  const navigate = useNavigate();
  const users = data?.pages?.flatMap(page => page.users) || [];

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
              {/* Only render FollowButton if isFollowing is not null */}
              {user.isFollowing !== null && (
                <FollowButton
                  userId={user.id}
                  isFollowing={user.isFollowing}
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