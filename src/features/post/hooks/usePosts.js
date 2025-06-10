import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, deletePost } from '../services/postService';
import { showToast } from '../../../utils/helpers/toast';

export const usePosts = (queryKey = ['posts', 'all'], invalidateQueries = []) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Fetch posts with infinite scrolling
  const fetchPostsQuery = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchPosts({ page: pageParam, limit: 10 });
      console.log('usePosts - fetchPosts result:', result);
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  const handleDeletePost = async (postId) => {
    setLoading(prev => ({ ...prev, delete: { ...prev.delete, [postId]: true } }));
    setError(null);
    try {
      await deletePost(postId);
      // Invalidate relevant queries
      await Promise.all(
        invalidateQueries.map(key =>
          queryClient.invalidateQueries({ queryKey: key })
        )
      );
      // Refetch posts for the current query
      await queryClient.invalidateQueries({ queryKey });
      showToast('Post deleted', 'success');
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      showToast(err.message || 'Failed to delete post', 'error');
    } finally {
      setLoading(prev => ({ ...prev, delete: { ...prev.delete, [postId]: false } }));
    }
  };

  return { ...fetchPostsQuery, handleDeletePost, loading, error };
};