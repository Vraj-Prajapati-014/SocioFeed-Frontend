import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getSavedPosts } from '../services/postService';
import { fetchProfile } from '../../profile/services/profileService';
import PostItem from '../components/PostItem';
import ProfileHeader from '../../profile/components/ProfileHeader';
import useAuth from '../../auth/hooks/useAuth';

const SavedPostsPage = () => {
  const { user } = useAuth();
  const [limit] = useState(10);

  // Fetch user profile
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    enabled: !!user?.id,
  });

  const fetchPostsCallback = useCallback(
    async ({ pageParam = 1 }) => {
      const result = await getSavedPosts(pageParam, limit);
      console.log('SavedPostsPage - Fetched posts for page:', pageParam, result);
      return result;
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

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  const handleFetchPosts = useCallback(() => {
    refetch();
  }, [refetch]);

  const allPosts = data?.pages?.flatMap(page => page.posts) || [];

  console.log('SavedPostsPage - All posts:', allPosts);

  if (isProfileLoading) {
    return (
      <Box className="flex justify-center my-4">
        <CircularProgress />
      </Box>
    );
  }

  if (profileError) {
    return (
      <Box className="max-w-2xl mx-auto p-4">
        <Typography color="error" className="my-4">
          Failed to load profile: {profileError.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="max-w-2xl mx-auto p-4">
      {/* Profile Header */}
      {/* {profile && (
        <ProfileHeader
          profile={profile}
          isOwnProfile={true}
          onProfileUpdate={(updatedProfile) => {
            // Update profile in cache if needed
            console.log('Profile updated:', updatedProfile);
          }}
        />
      )} */}

      <Typography variant="h5" className="my-4 font-semibold">
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
        <PostItem
          key={post.id}
          post={post}
          fetchPosts={handleFetchPosts}
        />
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