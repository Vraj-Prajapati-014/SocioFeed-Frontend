import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvatar } from '../services/profileService';
import { showToast } from '../../../utils/helpers/toast';

export const useUpdateAvatar = (userId) => { // Added userId parameter
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => updateAvatar(formData),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] }); // Changed to specific userId
      showToast(data.message, 'success');
    },
    onError: error => {
      showToast(error, 'error');
    },
  });
};