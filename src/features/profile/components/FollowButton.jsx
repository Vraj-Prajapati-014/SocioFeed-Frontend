import React from 'react';
import Button from '../../../components/common/Button/Button';
import { useFollow } from '../hook/useFollow';

const FollowButton = ({ userId, isFollowing }) => {
  const { follow, unfollow, isFollowingLoading } = useFollow(userId);

  const handleClick = () => {
    if (isFollowing) {
      unfollow(userId);
    } else {
      follow(userId);
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="small"
      disabled={isFollowingLoading}
      className={
        isFollowing
          ? 'text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }
    >
      {isFollowingLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow Back'}
    </Button>
  );
};

export default FollowButton;