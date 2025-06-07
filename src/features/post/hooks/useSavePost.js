import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePost, unsavePost } from '../services/postService';
import { showToast } from '../../../utils/helpers/toast';

export const useSavePost = (postId, userId) => {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => savePost(postId),
    onMutate: async () => {
      // Cancel any ongoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['posts', userId] });
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      // Snapshot the previous post data
      const previousPostInFeed = queryClient.getQueryData(['posts', userId]);
      const previousPostDetail = queryClient.getQueryData(['post', postId]);

      // Optimistically update the post in the home feed
      if (previousPostInFeed) {
        queryClient.setQueryData(['posts', userId], (old) => {
          if (!old || !old.posts) return old;
          return {
            ...old,
            posts: old.posts.map(post =>
              post.id === postId ? { ...post, isSaved: true } : post
            ),
          };
        });
      }

      // Optimistically update the post in the post detail page (if applicable)
      if (previousPostDetail) {
        queryClient.setQueryData(['post', postId], (old) => {
          if (!old) return old;
          return { ...old, post: { ...old.post, isSaved: true } };
        });
      }

      return { previousPostInFeed, previousPostDetail };
    },
    onError: (error, variables, context) => {
      // Revert the optimistic update on error
      if (context.previousPostInFeed) {
        queryClient.setQueryData(['posts', userId], context.previousPostInFeed);
      }
      if (context.previousPostDetail) {
        queryClient.setQueryData(['post', postId], context.previousPostDetail);
      }
      showToast(error.message || 'Failed to save post', 'error');
    },
    onSuccess: () => {
      // Invalidate queries to refetch the updated post data
      queryClient.invalidateQueries({ queryKey: ['posts', userId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts', userId] }); // If you have a saved posts page
      showToast('Post saved successfully', 'success');
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: () => unsavePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts', userId] });
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      const previousPostInFeed = queryClient.getQueryData(['posts', userId]);
      const previousPostDetail = queryClient.getQueryData(['post', postId]);

      if (previousPostInFeed) {
        queryClient.setQueryData(['posts', userId], (old) => {
          if (!old || !old.posts) return old;
          return {
            ...old,
            posts: old.posts.map(post =>
              post.id === postId ? { ...post, isSaved: false } : post
            ),
          };
        });
      }

      if (previousPostDetail) {
        queryClient.setQueryData(['post', postId], (old) => {
          if (!old) return old;
          return { ...old, post: { ...old.post, isSaved: false } };
        });
      }

      return { previousPostInFeed, previousPostDetail };
    },
    onError: (error, variables, context) => {
      if (context.previousPostInFeed) {
        queryClient.setQueryData(['posts', userId], context.previousPostInFeed);
      }
      if (context.previousPostDetail) {
        queryClient.setQueryData(['post', postId], context.previousPostDetail);
      }
      showToast(error.message || 'Failed to unsave post', 'error');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts', userId] });
      showToast('Post unsaved successfully', 'success');
    },
  });

  const handleSaveToggle = (isSaved) => {
    if (isSaved) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  return {
    handleSaveToggle,
    isLoading: saveMutation.isLoading || unsaveMutation.isLoading,
  };
};