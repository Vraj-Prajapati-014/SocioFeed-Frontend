import React from 'react';
import { Box } from '@mui/material';
import PostItem from '../../post/components/PostItem';

const ProfilePosts = ({ posts }) => {
  return (
    <Box className="mt-6">
      {posts?.length > 0 ? (
        posts.map(post => (
          <Box key={post.id} className="mb-6">
            <PostItem post={post} />
          </Box>
        ))
      ) : (
        <Box className="text-center text-gray-500 dark:text-gray-400">
          <p>No posts yet.</p>
        </Box>
      )}
    </Box>
  );
};

export default ProfilePosts;
