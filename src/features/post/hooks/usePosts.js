import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../services/postService';

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts', 'all'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchPosts({ page: pageParam, limit: 10 });
      console.log('usePosts - fetchPosts result:', result);
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: 'always', // Ensure fresh data
    refetchOnWindowFocus: false, // Prevent refetch on focus
  });
};