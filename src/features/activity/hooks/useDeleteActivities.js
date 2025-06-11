import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserActivities } from '../services/activityService';
import { showToast } from '../../../utils/helpers/toast';

export const useDeleteActivities = userId => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUserActivities,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['activities', userId] });

      const previousActivities = queryClient.getQueryData(['activities', userId]) || { pages: [] };

      queryClient.setQueryData(['activities', userId], { pages: [], pageParams: [] });

      return { previousActivities };
    },
    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(['activities', userId], context.previousActivities);
      }
      showToast(error.message || 'Failed to delete activities', 'error');
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['activities', userId] });
      showToast(data.message || 'Activities deleted successfully', 'success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', userId] });
    },
  });

  return {
    deleteActivities: deleteMutation.mutateAsync,
    isLoading: deleteMutation.isLoading,
  };
};
