import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../services/profileService';
// import { useSelector } from 'react-redux';
// const username=useSelector((state) => state.auth.user);
// console.log(username);

export const useProfile = username => {
  console.log('useProfile - Username:', username); // Debug
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfile(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};
