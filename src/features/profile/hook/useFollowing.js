import { useQuery } from '@tanstack/react-query';
import { fetchFollowing } from '../services/profileService';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';

export const useFollowing = (username, page = 1) => {
  return useQuery({
    queryKey: ['following', username, page],
    queryFn: () => fetchFollowing(username, page, PROFILE_CONSTANTS.DEFAULT_LIMIT),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};
