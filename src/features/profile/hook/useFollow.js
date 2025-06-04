import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser } from '../services/profileService';
import { showToast } from '../../../utils/helpers/toast';

export const useFollow = username => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: userId => followUser(userId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      showToast(data.message, 'success');
    },
    onError: error => {
      showToast(error, 'error');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: userId => unfollowUser(userId),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      showToast(data.message, 'success');
    },
    onError: error => {
      showToast(error, 'error');
    },
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowingLoading: followMutation.isLoading || unfollowMutation.isLoading,
  };
};
