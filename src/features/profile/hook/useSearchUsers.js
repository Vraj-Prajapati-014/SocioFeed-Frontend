import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../services/profileService';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';

export const useSearchUsers = (query, page = 1) => {
  return useQuery({
    queryKey: ['searchUsers', query, page],
    queryFn: () => searchUsers(query, page, PROFILE_CONSTANTS.DEFAULT_LIMIT),
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
};
