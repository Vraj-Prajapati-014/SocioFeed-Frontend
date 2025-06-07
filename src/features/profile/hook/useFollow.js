import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser } from '../services/profileService';
import { showToast } from '../../../utils/helpers/toast';
import useAuth from '../../auth/hooks/useAuth';

export const useFollow = (userId) => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: (targetUserId) => followUser(targetUserId),
    onMutate: async (targetUserId) => {
      await queryClient.cancelQueries({ queryKey: ['profile', targetUserId] });
      await queryClient.cancelQueries({ queryKey: ['profile', currentUserId] });

      const previousTargetProfile = queryClient.getQueryData(['profile', targetUserId]);
      const previousCurrentProfile = queryClient.getQueryData(['profile', currentUserId]);

      // Update target user's profile (increase followers)
      queryClient.setQueryData(['profile', targetUserId], (old) => ({
        ...old,
        isFollowing: true,
        followersCount: (old?.followersCount || 0) + 1,
      }));

      // Update current user's profile (increase following)
      queryClient.setQueryData(['profile', currentUserId], (old) => ({
        ...old,
        followingCount: (old?.followingCount || 0) + 1,
      }));

      return { previousTargetProfile, previousCurrentProfile };
    },
    onError: (error, targetUserId, context) => {
      queryClient.setQueryData(['profile', targetUserId], context.previousTargetProfile);
      queryClient.setQueryData(['profile', currentUserId], context.previousCurrentProfile);
      showToast(error.message || 'Failed to follow user', 'error');
    },
    onSuccess: (data) => {
      // Update target user's profile with actual counts
      queryClient.setQueryData(['profile', data.followingUser.id], (old) => ({
        ...old,
        isFollowing: true,
        followersCount: data.followingUser.followersCount,
        followingCount: data.followingUser.followingCount,
      }));

      // Update current user's profile with actual counts
      queryClient.setQueryData(['profile', data.followerUser.id], (old) => ({
        ...old,
        followersCount: data.followerUser.followersCount,
        followingCount: data.followerUser.followingCount,
      }));

      queryClient.invalidateQueries({ queryKey: ['profile', data.followingUser.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', data.followerUser.id] });
      queryClient.invalidateQueries({ queryKey: ['followers', data.followingUser.id] });
      queryClient.invalidateQueries({ queryKey: ['following', data.followerUser.id] });
      showToast(data.message, 'success');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (targetUserId) => unfollowUser(targetUserId),
    onMutate: async (targetUserId) => {
      await queryClient.cancelQueries({ queryKey: ['profile', targetUserId] });
      await queryClient.cancelQueries({ queryKey: ['profile', currentUserId] });

      const previousTargetProfile = queryClient.getQueryData(['profile', targetUserId]);
      const previousCurrentProfile = queryClient.getQueryData(['profile', currentUserId]);

      // Update target user's profile (decrease followers)
      queryClient.setQueryData(['profile', targetUserId], (old) => ({
        ...old,
        isFollowing: false,
        followersCount: (old?.followersCount || 0) - 1,
      }));

      // Update current user's profile (decrease following)
      queryClient.setQueryData(['profile', currentUserId], (old) => ({
        ...old,
        followingCount: (old?.followingCount || 0) - 1,
      }));

      return { previousTargetProfile, previousCurrentProfile };
    },
    onError: (error, targetUserId, context) => {
      queryClient.setQueryData(['profile', targetUserId], context.previousTargetProfile);
      queryClient.setQueryData(['profile', currentUserId], context.previousCurrentProfile);
      showToast(error.message || 'Failed to unfollow user', 'error');
    },
    onSuccess: (data) => {
      // Update target user's profile with actual counts
      queryClient.setQueryData(['profile', data.followingUser.id], (old) => ({
        ...old,
        isFollowing: false,
        followersCount: data.followingUser.followersCount,
        followingCount: data.followingUser.followingCount,
      }));

      // Update current user's profile with actual counts
      queryClient.setQueryData(['profile', data.followerUser.id], (old) => ({
        ...old,
        followersCount: data.followerUser.followersCount,
        followingCount: data.followerUser.followingCount,
      }));

      queryClient.invalidateQueries({ queryKey: ['profile', data.followingUser.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', data.followerUser.id] });
      queryClient.invalidateQueries({ queryKey: ['followers', data.followingUser.id] });
      queryClient.invalidateQueries({ queryKey: ['following', data.followerUser.id] });
      showToast(data.message, 'success');
    },
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowingLoading: followMutation.isLoading || unfollowMutation.isLoading,
  };
};