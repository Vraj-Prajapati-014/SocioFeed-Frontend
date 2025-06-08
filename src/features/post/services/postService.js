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
    return response.data;
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
    return response.data;
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
  try {
    const response = await axiosInstance.post(url, { content });
    console.log('postService - Create comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('postService - Error creating comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to create comment');
  }
};

export const likeComment = async (commentId) => {
  try {
    const response = await axiosInstance.post(`${POST_CONSTANTS.POSTS_BASE_URL}/comments/${commentId}/like`);
    console.log('postService - Like comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('postService - Error liking comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to like comment');
  }
};

export const unlikeComment = async (commentId) => {
  try {
    const response = await axiosInstance.delete(`${POST_CONSTANTS.POSTS_BASE_URL}/comments/${commentId}/unlike`); // Fixed URL
    console.log('postService - Unlike comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('postService - Error unliking comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to unlike comment');
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axiosInstance.delete(`${POST_CONSTANTS.POSTS_BASE_URL}/comments/${commentId}`);
    console.log('postService - Delete comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('postService - Error deleting comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete comment');
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axiosInstance.delete(`${POST_CONSTANTS.POSTS_BASE_URL}/${postId}`);
    console.log('postService - Delete post response:', response.data);
    return response.data;
  } catch (error) {
    console.error('postService - Error deleting post:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete post');
  }
};

export const savePost = async (postId) => {
  if (!postId) throw new Error('postId is not defined');
  try {
    const response = await axiosInstance.post(`${POST_CONSTANTS.POSTS_BASE_URL}/${postId}/save`);
    console.log('postService - Save post response:', response.data);
    return {
      message: response.data.message,
      isSaved: response.data.isSaved || true,
      post: response.data.post,
    };
  } catch (error) {
    console.error('postService - Error saving post:', error);
    throw new Error(error.response?.data?.message || 'Failed to save post');
  }
};
export const unsavePost = async (postId) => {
  if (!postId) throw new Error('postId is not defined');
  try {
    const response = await axiosInstance.delete(`${POST_CONSTANTS.POSTS_BASE_URL}/${postId}/save`);
    console.log('postService - Unsave post response:', response.data);
    return {
      message: response.data.message,
      isSaved: response.data.isSaved || false,
      post: response.data.post,
    };
  } catch (error) {
    console.error('postService - Error unsaving post:', error);
    throw new Error(error.response?.data?.message || 'Failed to unsave post');
  }
};

export const getPostById = async (postId, page = 1, limit = 10) => { // Removed userId since backend handles hasLiked
  if (!postId) {
    throw new Error('postId is not defined');
  }
  try {
    const response = await axiosInstance.get(`/posts/${postId}`, {
      params: { commentsPage: page, commentsLimit: limit },
    });
    console.log('postService - Get post by ID response:', {
      status: response.status,
      data: response.data,
    });

    const postData = response.data.data || {};

    return {
      post: {
        ...postData,
        user: postData.user || { username: 'Unknown', avatarUrl: '/default-avatar.png' },
        comments: postData.comments || [],
        images: postData.images || [],
      },
      totalComments: postData.totalComments || 0,
    };
  } catch (error) {
    console.error('postService - Error fetching post by ID:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};
export const getSavedPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/posts/saved`, {
      params: { page, limit },
    });
    console.log('postService - Get saved posts response:', {
      status: response.status,
      data: response.data,
    });
    return {
      posts: (response.data.data || []).map(post => ({
        ...post,
        author: {
          id: post.userId, // Use userId from the post
          ...(post.author || post.user || { username: 'Unknown', avatarUrl: '/default-avatar.png' }),
        },
        comments: post.comments || [],
        images: post.images || [],
      })),
      totalPosts: response.data.pagination.totalItems || 0,
      nextPage: response.data.pagination.hasNextPage ? page + 1 : null,
    };
  } catch (error) {
    console.error('postService - Error fetching saved posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch saved posts');
  }
};