import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserActivities } from '../services/activityService';
import { showToast } from '../../../utils/helpers/toast';

export const useDeleteActivities = userId => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUserActivities,
    onMutate: async () => {
      // Cancel any ongoing queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ['activities', userId] });

      // Get the current activities data from the cache
      const previousActivities = queryClient.getQueryData(['activities', userId]) || { pages: [] };

      // Optimistically update the cache to reflect the deletion
      queryClient.setQueryData(['activities', userId], { pages: [], pageParams: [] });

      // Return the context for rollback in case of error
      return { previousActivities };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous state if the mutation fails
      if (context?.previousActivities) {
        queryClient.setQueryData(['activities', userId], context.previousActivities);
      }
      showToast(error.message || 'Failed to delete activities', 'error');
    },
    onSuccess: data => {
      // Invalidate the query to refetch fresh data from the server
      queryClient.invalidateQueries({ queryKey: ['activities', userId] });
      showToast(data.message || 'Activities deleted successfully', 'success');
    },
    onSettled: () => {
      // Ensure the query is refetched after the mutation settles (success or error)
      queryClient.invalidateQueries({ queryKey: ['activities', userId] });
    },
  });

  return {
    deleteActivities: deleteMutation.mutateAsync,
    isLoading: deleteMutation.isLoading,
  };
};
