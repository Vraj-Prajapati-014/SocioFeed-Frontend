import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../services/postService';

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      console.log(allPages);

      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
