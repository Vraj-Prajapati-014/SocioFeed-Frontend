import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSearchHistory, deleteSearchHistoryEntry } from '../services/profileService';

export const useSearchHistory = (limit = 10) => {
  const queryClient = useQueryClient();

  // Fetch search history
  const {
    data: searchHistory,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['searchHistory'],
    queryFn: () => fetchSearchHistory(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete a search history entry
  const deleteMutation = useMutation({
    mutationFn: (entryId) => deleteSearchHistoryEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
    onError: (error) => {
      console.error('Failed to delete search history entry:', error.message);
    },
  });

  return {
    searchHistory: searchHistory || [],
    isLoading,
    isError,
    error,
    refetch,
    deleteSearchHistoryEntry: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};