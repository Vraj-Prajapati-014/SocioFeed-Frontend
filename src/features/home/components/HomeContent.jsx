import React from 'react';
import { Box } from '@mui/material';
import {usePosts} from '../../post/hooks/usePosts';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import PostItem from '../../post/components/PostItem';
import Spinner from '../../../components/common/Spinner/Spinner';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';

const HomeContent = () => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorMsg,
    refetch,
  } = usePosts();

  // Flatten posts and filter out invalid entries
  const posts = postsData?.pages?.flatMap(page => 
    Array.isArray(page.posts) ? page.posts.filter(post => post && post.id) : []
  ) || [];

  if (postsLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Spinner />
      </Box>
    );
  }

  if (postsError) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <ErrorMessage error={postsErrorMsg?.message || 'Failed to load posts'} onRetry={refetch} />
      </Box>
    );
  }

  return (
    <Box className="max-w-3xl mx-auto py-6">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<Spinner />}
        endMessage={<Box className="text-center text-gray-500 dark:text-gray-400 my-4">No more posts to show</Box>}
      >
        {posts.length > 0 ? (
          posts.map(post => (
            <Box key={post.id} className="mb-6">
              <PostItem post={post} />
            </Box>
          ))
        ) : (
          <Box className="text-center text-gray-500 dark:text-gray-400 my-4">
            <p>No posts available.</p>
          </Box>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default HomeContent;