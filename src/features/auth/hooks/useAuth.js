import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isAuthenticated, loading, errors } = useSelector(state => state.auth);
  return { user, isAuthenticated, loading, errors };
};

export default useAuth;
