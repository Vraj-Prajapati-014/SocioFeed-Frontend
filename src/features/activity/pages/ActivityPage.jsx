import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserActivities } from '../services/activityService';
import { useDeleteActivities } from '../hooks/useDeleteActivities';
import useAuth from '../../auth/hooks/useAuth';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import ThemeContext from '../../../utils/context/ThemeContext';

// Updated getActivityMessage to return message parts
const getActivityMessage = (activity) => {
  switch (activity.type) {
    case 'CREATE_POST': {
      return {
        prefix: 'You created a post: "',
        content: activity.post?.content || 'Post',
        suffix: '"',
      };
    }
    case 'LIKE_POST': {
      return {
        prefix: 'You liked a post: "',
        content: activity.post?.content || 'Post',
        suffix: `" by ${activity.post?.author?.username || 'Unknown'}`,
      };
    }
    case 'CREATE_COMMENT': {
      return {
        prefix: 'You commented: "',
        content: activity.comment?.content || 'Comment',
        suffix: '" on a post',
      };
    }
    case 'LIKE_COMMENT': {
      return {
        prefix: 'You liked a comment: "',
        content: activity.comment?.content || 'Comment',
        suffix: `" by ${activity.comment?.author?.username || 'Unknown'} on post "`,
        secondaryContent: activity.post?.content || 'Post',
        secondarySuffix: '"',
      };
    }
    default:
      return {
        prefix: `You performed an action: ${activity.type}`,
        content: '',
        suffix: '',
      };
  }
};

const ActivityPage = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [limit] = useState(10);

  const fetchActivitiesCallback = useCallback(
    async ({ pageParam = 1 }) => {
      const result = await getUserActivities(pageParam, limit);
      console.log('ActivityPage - Fetched activities for page:', pageParam, result);
      return result;
    },
    [limit]
  );

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch } = useInfiniteQuery({
    queryKey: ['activities', user?.id],
    queryFn: fetchActivitiesCallback,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return null;
    },
    enabled: !!user?.id,
    initialData: { pages: [], pageParams: [] },
  });

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
      await refetch();
    } catch (error) {
      console.error('ActivityPage - Error deleting activities:', error);
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
        <Typography className="my-4 text-red-500">
          {error.message || 'Failed to load activities'}
        </Typography>
      )}
      {!isLoading && !isError && allActivities.length === 0 && (
        <Typography className="my-4">No activities yet.</Typography>
      )}
      {allActivities.map(activity => {
        const { prefix, content, suffix, secondaryContent, secondarySuffix } = getActivityMessage(activity);
        return (
          <Card key={activity.id} className="w-full mb-4">
            <Box className="p-4">
              <Typography
                variant="body1"
                className={`inline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
              >
                {prefix}
                <Typography
                  variant="body1"
                  component="span"
                  className={`inline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} [&_p]:inline [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_br]:hidden`}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                {suffix}
                {secondaryContent && (
                  <>
                    <Typography
                      variant="body1"
                      component="span"
                      className={`inline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} [&_p]:inline [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_br]:hidden`}
                      dangerouslySetInnerHTML={{ __html: secondaryContent }}
                    />
                    {secondarySuffix}
                  </>
                )}
              </Typography>
              <Typography variant="caption" className="block text-gray-500 dark:text-gray-400">
                {new Date(activity.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Card>
        );
      })}
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