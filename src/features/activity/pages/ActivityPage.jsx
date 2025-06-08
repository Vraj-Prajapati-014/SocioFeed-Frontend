import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserActivities } from '../services/activityService';
import { useDeleteActivities } from '../hooks/useDeleteActivities';
import useAuth from '../../auth/hooks/useAuth';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';

const ActivityPage = () => {
  const { user } = useAuth();
  const [limit] = useState(10);

  const fetchActivitiesCallback = useCallback(
    async ({ pageParam = 1 }) => {
      const result = await getUserActivities(pageParam, limit);
      console.log('ActivityPage - Fetched activities for page:', pageParam, result);
      return result;
    },
    [limit]
  );

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch } = useInfiniteQuery(
    {
      queryKey: ['activities', user?.id],
      queryFn: fetchActivitiesCallback,
      getNextPageParam: lastPage => {
        // Ensure lastPage and pagination exist before accessing properties
        if (lastPage?.pagination?.hasNextPage) {
          return lastPage.pagination.currentPage + 1;
        }
        return null;
      },
      enabled: !!user?.id,
      initialData: { pages: [], pageParams: [] }, // Provide initial data to avoid undefined
    }
  );

  const { deleteActivities, isLoading: isDeleting } = useDeleteActivities(user?.id);

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  // Flatten and filter duplicates
  const allActivitiesRaw = data?.pages?.flatMap(page => page.activities || []) || [];
  const uniqueActivitiesMap = new Map();

  allActivitiesRaw.forEach(activity => {
    const key = `${activity.userId}-${activity.type}-${activity.postId || 'null'}-${activity.commentId || 'null'}`;
    if (
      !uniqueActivitiesMap.has(key) ||
      new Date(activity.createdAt) > new Date(uniqueActivitiesMap.get(key).createdAt)
    ) {
      uniqueActivitiesMap.set(key, activity);
    }
  });

  const allActivities = Array.from(uniqueActivitiesMap.values());

  const handleDeleteAll = async () => {
    try {
      await deleteActivities();
      // Force a refetch after deletion to ensure the UI is in sync
      await refetch();
    } catch (error) {
      console.error('ActivityPage - Error deleting activities:', error);
    }
  };

  const getActivityMessage = activity => {
    switch (activity.type) {
      case 'CREATE_POST':
        return `You created a post: "${activity.post?.content || 'Post'}"`;
      case 'LIKE_POST':
        return `You liked a post: "${activity.post?.content || 'Post'}" by ${activity.post?.author?.username || 'Unknown'}`;
      case 'CREATE_COMMENT':
        return `You commented: "${activity.comment?.content || 'Comment'}" on a post`;
      case 'LIKE_COMMENT':
        return `You liked a comment: "${activity.comment?.content || 'Comment'}" by ${activity.comment?.author?.username || 'Unknown'} on post "${activity.post?.content || 'Post'}"`;
      default:
        return `You performed an action: ${activity.type}`;
    }
  };

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-semibold">
          Your Activity
        </Typography>
        {allActivities.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAll}
            disabled={isDeleting || isLoading}
          >
            {isDeleting ? 'Deleting...' : 'Clear All Activities'}
          </Button>
        )}
      </Box>

      {isLoading && (
        <Box className="flex justify-center my-4">
          <Spinner />
        </Box>
      )}
      {isError && (
        <Typography color="error" className="my-4">
          {error.message || 'Failed to load activities'}
        </Typography>
      )}
      {!isLoading && !isError && allActivities.length === 0 && (
        <Typography className="my-4">No activities yet.</Typography>
      )}
      {allActivities.map(activity => (
        <Card key={activity.id} className="w-full mb-4">
          <Box className="p-4">
            <Typography variant="body1" className="text-gray-800 dark:text-gray-300">
              {getActivityMessage(activity)}
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              {new Date(activity.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Card>
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

export default ActivityPage;
