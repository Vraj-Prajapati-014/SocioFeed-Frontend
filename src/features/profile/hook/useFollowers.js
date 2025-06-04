import { useQuery } from '@tanstack/react-query';
import { fetchFollowers } from '../services/profileService';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';

export const useFollowers = (username, page = 1) => {
  return useQuery({
    queryKey: ['followers', username, page],
    queryFn: () => fetchFollowers(username, page, PROFILE_CONSTANTS.DEFAULT_LIMIT),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};
