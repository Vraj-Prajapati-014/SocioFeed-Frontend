import axiosInstance from '../../auth/slices/axiosInstance'; // Reuse existing axiosInstance
import { PROFILE_CONSTANTS } from '../constants/profileConstants';

// Get profile by username
export const fetchProfile = async username => {
  console.log('fetchProfile - Username:', username); // Debug
  const url = `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_BY_USERNAME.replace(':username', username)}`;
  console.log('fetchProfile - Constructed URL:', url); // Debug
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to fetch profile';
  }
};

// Update user info (username, bio)
export const updateProfileInfo = async data => {
  try {
    const response = await axiosInstance.put(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_UPDATE_INFO}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to update profile';
  }
};

// Update avatar
export const updateAvatar = async formData => {
  try {
    const response = await axiosInstance.put(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_UPDATE_AVATAR}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to update avatar';
  }
};

// Follow a user
export const followUser = async userId => {
  try {
    const response = await axiosInstance.post(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOW.replace(':userId', userId)}`
    );
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to follow user';
  }
};

// Unfollow a user
export const unfollowUser = async userId => {
  try {
    const response = await axiosInstance.post(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_UNFOLLOW.replace(':userId', userId)}`
    );
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to unfollow user';
  }
};

// Get followers list
export const fetchFollowers = async (username, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOWERS.replace(':username', username)}`,
      { params: { page, limit } }
    );
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to fetch followers';
  }
};

// Get following list
export const fetchFollowing = async (username, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOWING.replace(':username', username)}`,
      { params: { page, limit } }
    );
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to fetch following';
  }
};

// Search users
export const searchUsers = async (query, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_SEARCH}`,
      {
        params: { query, page, limit },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to search users';
  }
};
