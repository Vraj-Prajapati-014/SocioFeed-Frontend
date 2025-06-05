import { useState } from 'react';
import { createComment, likeComment, unlikeComment, deleteComment } from '../services/postService';
import { POST_CONSTANTS } from '../constants/postConstants';

export const useComments = (postId, fetchPosts) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateComment = async (content, parentCommentId = null) => {
    if (content.length > POST_CONSTANTS.MAX_COMMENT_LENGTH) {
      setError('Comment exceeds maximum length');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createComment(postId, content, parentCommentId);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create comment');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId, hasLiked) => {
    setLoading(true);
    setError(null);
    try {
      if (hasLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment like');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteComment(commentId);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateComment, handleLikeComment, handleDeleteComment, loading, error };
};