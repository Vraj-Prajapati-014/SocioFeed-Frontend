import axiosInstance from '../../auth/slices/axiosInstance';

export const getUserActivities = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/activities', {
      params: { page, limit },
    });
    console.log('activityService - Get user activities response:', {
      status: response.status,
      data: response.data,
    });
    return {
      activities: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    console.error('activityService - Error fetching user activities:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch activities');
  }
};

export const deleteUserActivities = async () => {
  try {
    const response = await axiosInstance.delete('/activities');
    console.log('activityService - Delete user activities response:', response.data);
    return response.data;
  } catch (error) {
    console.error('activityService - Error deleting user activities:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete activities');
  }
};
