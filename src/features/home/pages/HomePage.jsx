import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import useAuth from '../../auth/hooks/useAuth';
import ProfileHeader from '../../profile/components/ProfileHeader';
import { useProfile } from '../../profile/hook/useProfile';
import { usePosts } from '../../post/hooks/usePosts';
import PostItem from '../../post/components/PostItem';
import Spinner from '../../../components/common/Spinner/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { routeConstants } from '../../auth/constants/routeConstants';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Use useAuth hook
  const username = user?.username;

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(username);

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isLoading: postsLoading,
    error: postsError,
  } = usePosts();

  const posts =
    postsData?.pages
      ?.flatMap(page => (Array.isArray(page?.posts) ? page.posts : []))
      .filter(post => post && typeof post === 'object' && post.id) || [];

  if (profileLoading || postsLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Spinner />
      </Box>
    );
  }

  if (profileError || postsError) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {profileError?.message || postsError?.message}</p>
      </Box>
    );
  }

  return (
    <Box className="max-w-3xl mx-auto py-6">
      {profile && (
        <Box className="mb-8">
          <ProfileHeader profile={profile} isOwnProfile={true} />
        </Box>
      )}

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <Box className="flex justify-center my-4">
            <Spinner />
          </Box>
        }
        endMessage={
          <p className="text-center text-gray-500 dark:text-gray-400 my-4">No more posts to show</p>
        }
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

export default HomePage;
