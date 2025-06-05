import React from 'react';
import { Box, Typography, Avatar} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFollowers } from '../hook/useFollowers';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import FollowButton from './FollowButton';
import MessageButton from '../../messages/components/MessageButton';

const FollowerList = ({ userId, username }) => {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch } = useFollowers(userId);

  const followers = data?.pages?.flatMap(page => page.followers) || [];

  if (isLoading) {
    return <SkeletonLoader type="list" count={3} />;
  }

  if (isError) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Followers</Typography>
      <InfiniteScroll
        dataLength={followers.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<SkeletonLoader type="list" />}
        endMessage="No more followers to show"
      >
        {followers.length > 0 ? (
          followers.map(follower => (
            <Box key={follower.id} className="flex items-center justify-between p-2">
              <Box
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/profile/${follower.id}`, { state: { username: follower.username } })}
              >
                <Avatar
                  src={follower.avatarUrl || '/default-avatar.png'}
                  alt={follower.username}
                  className="w-10 h-10 mr-3"
                />
                <Typography>{follower.username}</Typography>
              </Box>
              {/* Show MessageButton if already following, otherwise show FollowButton */}
              {follower.isFollowing ? (
                <MessageButton userId={follower.id} username={follower.username} />
              ) : (
                <FollowButton userId={follower.id} isFollowing={follower.isFollowing} />
              )}
            </Box>
          ))
        ) : (
          <Typography className="text-gray-500 dark:text-gray-400">No followers yet.</Typography>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default FollowerList;