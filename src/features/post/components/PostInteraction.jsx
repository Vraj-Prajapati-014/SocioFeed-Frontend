import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Favorite, FavoriteBorder, Comment, Share, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ThemeContext from '../../../utils/context/ThemeContext';
import { showToast } from '../../../utils/helpers/toast';
import { likePost, unlikePost } from '../services/postService';
import { useSavePost } from '../hooks/useSavePost';
import useAuth from '../../auth/hooks/useAuth';

const PostInteraction = ({ post }) => {
  const { theme } = React.useContext(ThemeContext);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [liked, setLiked] = React.useState(post?.hasLiked || false);
  const [likesCount, setLikesCount] = React.useState(post?.likesCount || 0);
  const [saved, setSaved] = React.useState(post?.isSaved || false);

  const { handleSaveToggle, isLoading: isSaving } = useSavePost(post?.id, user?.id);

  if (!post || !post.id) {
    return (
      <Box className="flex items-center justify-between mb-2">
        <Typography variant="caption" color="error">
          Post not available
        </Typography>
      </Box>
    );
  }

  const likeMutation = useMutation({
    mutationFn: () => likePost(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousLikes = likesCount;
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      return { previousLikes, previousLiked: liked };
    },
    onError: (error, _, context) => {
      setLiked(context.previousLiked);
      setLikesCount(context.previousLikes);
      showToast(error.message || 'Failed to like post', 'error');
    },
    onSuccess: (data) => {
      setLikesCount(data.likesCount);
      setLiked(data.hasLiked);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showToast('Post liked', 'success');
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousLikes = likesCount;
      setLiked(false);
      setLikesCount((prev) => prev - 1);
      return { previousLikes, previousLiked: liked };
    },
    onError: (error, _, context) => {
      setLiked(context.previousLiked);
      setLikesCount(context.previousLikes);
      showToast(error.message || 'Failed to unlike post', 'error');
    },
    onSuccess: (data) => {
      setLikesCount(data.likesCount);
      setLiked(data.hasLiked);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showToast('Post unliked', 'success');
    },
  });

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    if (liked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleSaveToggleClick = async (e) => {
    e.stopPropagation();
    try {
      const newIsSaved = await handleSaveToggle(saved);
      setSaved(newIsSaved);
    } catch (error) {
      showToast('Failed to toggle save state', 'error');
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    console.log('Navigate to comments for post:', post.id);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
    showToast('Link copied to clipboard', 'success');
  };

  return (
    <Box className="flex items-center justify-between mb-2">
      <Box className="flex items-center space-x-2">
        <IconButton
          onClick={handleLikeToggle}
          disabled={likeMutation.isPending || unlikeMutation.isPending}
        >
          {liked ? (
            <Favorite className="text-red-500" />
          ) : (
            <FavoriteBorder className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </IconButton>
        <IconButton onClick={handleCommentClick}>
          <Comment className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
        </IconButton>
        <IconButton onClick={handleShareClick}>
          <Share className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
        </IconButton>
        <IconButton onClick={handleSaveToggleClick} disabled={isSaving}>
          {saved ? (
            <Bookmark className="text-blue-500" />
          ) : (
            <BookmarkBorder className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </IconButton>
      </Box>
      <Typography
        variant="caption"
        className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
      >
        {likesCount} likes
      </Typography>
    </Box>
  );
};

export default PostInteraction;