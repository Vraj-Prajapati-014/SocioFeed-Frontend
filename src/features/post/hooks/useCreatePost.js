import { useState } from 'react';
import { createPost } from '../services/postService';
import { POST_CONSTANTS } from '../constants/postConstants';

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePost = async (content, media, onSuccess) => {
    if (content.length > POST_CONSTANTS.MAX_CONTENT_LENGTH) {
      setError('Content exceeds maximum length');
      return;
    }
    if (media.length > POST_CONSTANTS.MAX_IMAGES_PER_POST) {
      setError('Too many images');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createPost(content, media);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return { handleCreatePost, loading, error };
};