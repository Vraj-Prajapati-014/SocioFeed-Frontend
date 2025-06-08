import { followUser, unfollowUser } from '../services/profileService';
import { showToast } from '../../../utils/helpers/toast';

export const useFollow = () => {
  const follow = async (targetUserId, onSuccessCallback) => {
    try {
      const response = await followUser(targetUserId);
      showToast(response.message, 'success');
      if (onSuccessCallback) {
        await onSuccessCallback(); // Trigger the callback to refresh data
      }
    } catch (error) {
      console.error('Error following user:', error);
      showToast(error.message || 'Failed to follow user', 'error');
      throw error;
    }
  };

  const unfollow = async (targetUserId, onSuccessCallback) => {
    try {
      const response = await unfollowUser(targetUserId);
      showToast(response.message, 'success');
      if (onSuccessCallback) {
        await onSuccessCallback(); // Trigger the callback to refresh data
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      showToast(error.message || 'Failed to unfollow user', 'error');
      throw error;
    }
  };

  return {
    follow,
    unfollow,
    isFollowingLoading: false, // We'll manage loading state in the component
  };
};