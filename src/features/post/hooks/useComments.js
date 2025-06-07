import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createComment, likeComment, unlikeComment, deleteComment } from '../services/postService';
import { POST_CONSTANTS } from '../constants/postConstants';
import { showToast } from '../../../utils/helpers/toast';

export const useComments = (postId, fetchPosts) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const handleCreateComment = async (content, parentCommentId = null) => {
    if (content.length > POST_CONSTANTS.MAX_COMMENT_LENGTH) {
      setError('Comment exceeds maximum length');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createComment(postId, content, parentCommentId);
      await queryClient.invalidateQueries({ queryKey: ['post', postId] });
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create comment');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId, hasLiked, currentLikesCount) => {
    setLoading(true);
    setError(null);
    console.log(currentLikesCount);
    

    const previousPostData = queryClient.getQueryData(['post', postId]);

    const updateCommentLikes = (comments) => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            hasLiked: !hasLiked,
            likesCount: hasLiked ? (comment.likesCount || 0) - 1 : (comment.likesCount || 0) + 1,
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateCommentLikes(comment.replies) };
        }
        return comment;
      });
    };

    try {
      // Optimistic update
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old || !old.post) return old;
        return {
          ...old,
          post: {
            ...old.post,
            comments: updateCommentLikes(old.post.comments),
          },
        };
      });

      let response;
      if (hasLiked) {
        response = await unlikeComment(commentId);
        showToast('Comment unliked', 'success');
      } else {
        response = await likeComment(commentId);
        showToast('Comment liked', 'success');
      }

      // Update with actual server response
      queryClient.setQueryData(['post', postId], (old) => {
        if (!old || !old.post) return old;
        const updatedComments = old.post.comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              hasLiked: response.hasLiked,
              likesCount: response.likesCount,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentLikes(comment.replies),
            };
          }
          return comment;
        });

        return {
          ...old,
          post: { ...old.post, comments: updatedComments },
        };
      });

      await queryClient.invalidateQueries({ queryKey: ['post', postId] });
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment like');
      showToast(err.response?.data?.message || 'Failed to update comment like', 'error');
      queryClient.setQueryData(['post', postId], previousPostData);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteComment(commentId);
      await queryClient.invalidateQueries({ queryKey: ['post', postId] });
      fetchPosts();
      showToast('Comment deleted', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
      showToast(err.response?.data?.message || 'Failed to delete comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateComment, handleLikeComment, handleDeleteComment, loading, error };
};