import axiosInstance from '../../auth/slices/axiosInstance';
import { PROFILE_CONSTANTS } from '../constants/profileConstants.js';

export const fetchProfile = async (userId) => {
  const url = `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_BY_ID.replace(':id', userId)}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch profile');
  }
};

export const updateProfileInfo = async (data) => {
  try {
    const response = await axiosInstance.put(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_UPDATE_INFO}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update profile');
  }
};

export const updateAvatar = async (formData) => {
  try {
    const response = await axiosInstance.put(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_UPDATE_AVATAR}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update avatar');
  }
};

export const followUser = async (userId) => {
  try {
    const response = await axiosInstance.post(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOW.replace(':userId', userId)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to follow user');
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await axiosInstance.post(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_UNFOLLOW.replace(':userId', userId)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to unfollow user');
  }
};

export const fetchFollowers = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOWERS.replace(':id', userId)}`,
      { params: { page, limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch followers');
  }
};

export const fetchFollowing = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOWING.replace(':id', userId)}`,
      { params: { page, limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch following');
  }
};

export const searchUsers = async (query, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_SEARCH}`,
      { params: { query, page, limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to search users');
  }
};