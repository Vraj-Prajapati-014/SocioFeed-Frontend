import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvatar } from '../services/profileService';
import { showToast } from '../../../utils/helpers/toast';

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => updateAvatar(formData),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      showToast(data.message, 'success');
    },
    onError: error => {
      showToast(error, 'error');
    },
  });
};
