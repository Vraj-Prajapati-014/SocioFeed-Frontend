import React, { useState, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getSavedPosts } from '../services/postService';
import PostItem from '../components/PostItem';
import useAuth from '../../auth/hooks/useAuth';

const SavedPostsPage = () => {
  const { user } = useAuth();
  const [limit] = useState(10);

  const fetchPostsCallback = useCallback(
    async ({ pageParam = 1 }) => {
      return await getSavedPosts(pageParam, limit);
    },
    [limit]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['savedPosts', user?.id],
    queryFn: fetchPostsCallback,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!user?.id,
  });

  const handleFetchPosts = useCallback(() => {
    refetch();
  }, [refetch]);

  const allPosts = data?.pages?.flatMap(page => page.posts) || [];

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Typography variant="h5" className="mb-4 font-semibold">
        Saved Posts
      </Typography>
      {isLoading && (
        <Box className="flex justify-center my-4">
          <CircularProgress />
        </Box>
      )}
      {isError && (
        <Typography color="error" className="my-4">
          {error.message || 'Failed to load saved posts'}
        </Typography>
      )}
      {!isLoading && !isError && allPosts.length === 0 && (
        <Typography className="my-4">No saved posts yet.</Typography>
      )}
      {allPosts.map((post) => (
        <PostItem key={post.id} post={post} fetchPosts={handleFetchPosts} />
      ))}
      {hasNextPage && (
        <Box className="flex justify-center my-4">
          <Typography
            variant="button"
            onClick={() => fetchNextPage()}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            Load More
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SavedPostsPage;