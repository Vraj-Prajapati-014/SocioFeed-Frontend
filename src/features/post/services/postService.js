import axiosInstance from '../../auth/slices/axiosInstance';
import { POST_CONSTANTS } from '../constants/postConstants';

export const fetchPosts = async ({ page = 1, limit = 10 }) => {
  try {
    const response = await axiosInstance.get('/posts', {
      params: { page, limit },
    });
    console.log('postService - API response:', {
      status: response.status,
      data: response.data,
    });
    return {
      posts: (response.data.data || []).map(post => ({
        ...post,
        author: post.user || { username: 'Unknown', avatarUrl: '/default-avatar.png' },
        comments: post.comments || [],
        images: post.images || [],
      })),
      nextPage: response.data.pagination.hasNextPage ? response.data.pagination.currentPage + 1 : null,
    };
  } catch (error) {
    console.error('postService - Error fetching posts:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
};

export const likePost = async (postId) => {
  if (!postId) {
    throw new Error('postId is not defined');
  }
  try {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    console.log('postService - Like post response:', response.data);
    return response.data; // Returns { message, likesCount, hasLiked }
  } catch (error) {
    console.error('postService - Error liking post:', error);
    throw new Error(error.response?.data?.message || 'Failed to like post');
  }
};

export const unlikePost = async (postId) => {
  if (!postId) {
    throw new Error('postId is not defined');
  }
  try {
    const response = await axiosInstance.delete(`/posts/${postId}/like`);
    console.log('postService - Unlike post response:', response.data);
    return response.data; // Returns { message, likesCount, hasLiked }
  } catch (error) {
    console.error('postService - Error unliking post:', error);
    throw new Error(error.response?.data?.message || 'Failed to unlike post');
  }
};

export const createPost = async (content, media) => {
  const formData = new FormData();
  formData.append('content', content);
  media.forEach(file => formData.append('media', file));
  const response = await axiosInstance.post(`${POST_CONSTANTS.POSTS_BASE_URL}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};


export const createComment = async (postId, content, parentCommentId = null) => {
  const url = parentCommentId
    ? `${POST_CONSTANTS.POSTS_BASE_URL}/${postId}/comments/${parentCommentId}/reply`
    : `${POST_CONSTANTS.POSTS_BASE_URL}/${postId}/comments`;
  const response = await axiosInstance.post(url, { content });
  return response.data;
};

export const likeComment = async (commentId) => {
  const response = await axiosInstance.post(`${POST_CONSTANTS.POSTS_BASE_URL}/comments/${commentId}/like`);
  return response.data;
};

export const unlikeComment = async (commentId) => {
  const response = await axiosInstance.delete(`${POST_CONSTANTS.POSTS_BASE_URL}/comments/${commentId}/unlike`);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(`${POST_CONSTANTS.POSTS_BASE_URL}/comments/${commentId}`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`${POST_CONSTANTS.POSTS_BASE_URL}/${postId}`);
  return response.data;
};