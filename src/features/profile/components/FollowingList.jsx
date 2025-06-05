import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFollowing } from '../hook/useFollowing';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import MessageButton from '../../messages/components/MessageButton';

const FollowingList = ({ userId, username }) => {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch } = useFollowing(userId);

  const following = data?.pages?.flatMap(page => page.following) || [];

  if (isLoading) {
    return <SkeletonLoader type="list" count={3} />;
  }

  if (isError) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Following</Typography>
      <InfiniteScroll
        dataLength={following.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<SkeletonLoader type="list" />}
        endMessage="No more following to show"
      >
        {following.length > 0 ? (
          following.map(follow => (
            <Box key={follow.id} className="flex items-center justify-between p-2">
              <Box
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/profile/${follow.id}`, { state: { username: follow.username } })}
              >
                <Avatar
                  src={follow.avatarUrl || '/default-avatar.png'}
                  alt={follow.username}
                  className="w-10 h-10 mr-3"
                />
                <Typography>{follow.username}</Typography>
              </Box>
              <MessageButton userId={follow.id} username={follow.username} />
            </Box>
          ))
        ) : (
          <Typography className="text-gray-500 dark:text-gray-400">Not following anyone yet.</Typography>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default FollowingList;