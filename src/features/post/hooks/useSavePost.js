import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePost, unsavePost } from '../services/postService';
import { showToast } from '../../../utils/helpers/toast';

export const useSavePost = (postId, userId) => {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => savePost(postId),
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
              post.id === postId ? { ...post, isSaved: true } : post
            ),
          };
        });
      }

      if (previousPostDetail) {
        queryClient.setQueryData(['post', postId], (old) => {
          if (!old) return old;
          return { ...old, post: { ...old.post, isSaved: true } };
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
      showToast(error.message || 'Failed to save post', 'error');
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['posts', userId], (old) => {
        if (!old || !old.posts) return old;
        return {
          ...old,
          posts: old.posts.map(post =>
            post.id === postId ? { ...post, isSaved: data.isSaved } : post
          ),
        };
      });
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old) return old;
        return { ...old, post: { ...old.post, isSaved: data.isSaved } };
      });
      queryClient.invalidateQueries({ queryKey: ['posts', userId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts', userId] });
      showToast(data.message, 'success');
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
    onSuccess: (data) => {
      queryClient.setQueryData(['posts', userId], (old) => {
        if (!old || !old.posts) return old;
        return {
          ...old,
          posts: old.posts.map(post =>
            post.id === postId ? { ...post, isSaved: data.isSaved } : post
          ),
        };
      });
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old) return old;
        return { ...old, post: { ...old.post, isSaved: data.isSaved } };
      });
      queryClient.invalidateQueries({ queryKey: ['posts', userId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts', userId] });
      showToast(data.message, 'success');
    },
  });

  const handleSaveToggle = async (isSaved) => {
    if (isSaved) {
      const data = await unsaveMutation.mutateAsync();
      return data.isSaved; // Return boolean isSaved
    } else {
      const data = await saveMutation.mutateAsync();
      return data.isSaved; // Return boolean isSaved
    }
  };

  return {
    handleSaveToggle,
    isLoading: saveMutation.isPending || unsaveMutation.isPending, // Use isPending for React Query v5
  };
};