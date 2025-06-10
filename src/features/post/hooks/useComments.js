import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createComment, likeComment, unlikeComment, deleteComment, editComment } from '../services/postService';
import { POST_CONSTANTS } from '../constants/postConstants';
import { showToast } from '../../../utils/helpers/toast';

export const useComments = (postId, fetchPosts) => {
  const [loading, setLoading] = useState({ create: false, like: {}, delete: {}, edit: {} });
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const handleCreateComment = async (content, parentCommentId = null) => {
    if (content.length > POST_CONSTANTS.MAX_COMMENT_LENGTH) {
      setError('Comment exceeds maximum length');
      return;
    }

    setLoading(prev => ({ ...prev, create: true }));
    setError(null);
    try {
      await createComment(postId, content, parentCommentId);
      await queryClient.invalidateQueries({ queryKey: ['post', postId] });
      fetchPosts();
      showToast('Comment created', 'success');
    } catch (err) {
      setError(err.message || 'Failed to create comment');
      showToast(err.message || 'Failed to create comment', 'error');
    } finally {
      setLoading(prev => ({ ...prev, create: false })); // Fixed: Set create to false
    }
  };

  const handleLikeComment = async (commentId, hasLiked) => {
    setLoading(prev => ({ ...prev, like: { ...prev.like, [commentId]: true } }));
    setError(null);

    const previousPostData = queryClient.getQueryData(['post', postId]);

    try {
      // Optimistic update
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old || !old.post) return old;
        const updateComment = (comments) =>
          comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                hasLiked: !hasLiked,
                likesCount: hasLiked ? (comment.likesCount || 0) - 1 : (comment.likesCount || 0) + 1,
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateComment(comment.replies) };
            }
            return comment;
          });

        return {
          ...old,
          post: {
            ...old.post,
            comments: updateComment(old.post.comments),
          },
        };
      });

      const response = hasLiked ? await unlikeComment(commentId) : await likeComment(commentId);
      showToast(hasLiked ? 'Comment unliked' : 'Comment liked', 'success');

      // Update with actual server response
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old || !old.post) return old;
        const updateComment = (comments) =>
          comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                hasLiked: response.hasLiked,
                likesCount: response.likesCount,
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateComment(comment.replies) };
            }
            return comment;
          });

        return {
          ...old,
          post: {
            ...old.post,
            comments: updateComment(old.post.comments),
          },
        };
      });

      await queryClient.invalidateQueries({ queryKey: ['post', postId] });
      fetchPosts();
    } catch (err) {
      setError(err.message || 'Failed to update comment like');
      showToast(err.message || 'Failed to update comment like', 'error');
      queryClient.setQueryData(['post', postId], previousPostData);
    } finally {
      setLoading(prev => ({ ...prev, like: { ...prev.like, [commentId]: false } }));
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(prev => ({ ...prev, delete: { ...prev.delete, [commentId]: true } }));
    setError(null);
    try {
      await deleteComment(commentId);
      await queryClient.invalidateQueries({ queryKey: ['post', postId] });
      fetchPosts();
      showToast('Comment deleted', 'success');
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
      showToast(err.message || 'Failed to delete comment', 'error');
    } finally {
      setLoading(prev => ({ ...prev, delete: { ...prev.delete, [commentId]: false } }));
    }
  };

  const handleEditComment = async (commentId, content) => {
    if (content.length > POST_CONSTANTS.MAX_COMMENT_LENGTH) {
      setError('Comment exceeds maximum length');
      return;
    }

    setLoading(prev => ({ ...prev, edit: { ...prev.edit, [commentId]: true } }));
    setError(null);

    const previousPostData = queryClient.getQueryData(['post', postId]);

    try {
      // Optimistic update
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old || !old.post) return old;
        const updateComment = (comments) =>
          comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, content };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateComment(comment.replies) };
            }
            return comment;
          });

        return {
          ...old,
          post: {
            ...old.post,
            comments: updateComment(old.post.comments),
          },
        };
      });

      const response = await editComment(commentId, content);
      showToast('Comment updated', 'success');

      // Update with server response
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old || !old.post) return old;
        const updateComment = (comments) =>
          comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, content: response.content };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateComment(comment.replies) };
            }
            return comment;
          });

        return {
          ...old,
          post: {
            ...old.post,
            comments: updateComment(old.post.comments),
          },
        };
      });

      await queryClient.invalidateQueries({ queryKey: ['post', postId] });
      fetchPosts();
    } catch (err) {
      setError(err.message || 'Failed to edit comment');
      showToast(err.message || 'Failed to edit comment', 'error');
      queryClient.setQueryData(['post', postId], previousPostData);
    } finally {
      setLoading(prev => ({ ...prev, edit: { ...prev.edit, [commentId]: false } }));
    }
  };

  return { handleCreateComment, handleLikeComment, handleDeleteComment, handleEditComment, loading, error };
};