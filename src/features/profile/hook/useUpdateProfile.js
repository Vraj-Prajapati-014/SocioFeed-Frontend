import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileInfo } from '../services/profileService';

export const useUpdateProfile = (userId) => { // Added userId parameter
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateProfileInfo(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] }); // Changed to specific userId
    },
  });
};