import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser } from '../services/profileService';
import { showToast } from '../../../utils/helpers/toast';

export const useFollow = (userId) => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: (userId) => followUser(userId),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['profile', userId] });
      const previousProfile = queryClient.getQueryData(['profile', userId]);
      queryClient.setQueryData(['profile', userId], (old) => ({
        ...old,
        isFollowing: true,
        followersCount: old.followersCount + 1,
      }));
      return { previousProfile };
    },
    onError: (error, id, context) => {
      if (error.response?.data?.error === 'You are already following this user') {
        // The user is already following, so keep isFollowing as true
        queryClient.setQueryData(['profile', userId], (old) => ({
          ...old,
          isFollowing: true,
        }));
        showToast('You are already following this user', 'info');
      } else {
        // Revert on other errors
        queryClient.setQueryData(['profile', userId], context.previousProfile);
        showToast(error.message || 'Failed to follow user', 'error');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      showToast(data.message, 'success');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (userId) => unfollowUser(userId),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['profile', userId] });
      const previousProfile = queryClient.getQueryData(['profile', userId]);
      queryClient.setQueryData(['profile', userId], (old) => ({
        ...old,
        isFollowing: false,
        followersCount: old.followersCount - 1,
      }));
      return { previousProfile };
    },
    onError: (error, id, context) => {
      if (error.response?.data?.error === 'You are not following this user') {
        // The user is not following, so keep isFollowing as false
        queryClient.setQueryData(['profile', userId], (old) => ({
          ...old,
          isFollowing: false,
        }));
        showToast('You are not following this user', 'info');
      } else {
        // Revert on other errors
        queryClient.setQueryData(['profile', userId], context.previousProfile);
        showToast(error.message || 'Failed to unfollow user', 'error');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      showToast(data.message, 'success');
    },
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowingLoading: followMutation.isLoading || unfollowMutation.isLoading,
  };
};