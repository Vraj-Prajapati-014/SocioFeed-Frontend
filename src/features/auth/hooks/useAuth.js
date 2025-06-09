import { useSelector, useDispatch } from 'react-redux';
import { refreshTokenAsync } from '../slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAuthChecked, loading, errors } = useSelector(
    (state) => state.auth
  );

  const refreshToken = () => {
    dispatch(refreshTokenAsync());
  };

  return {
    user,
    isAuthenticated,
    isAuthChecked,
    loading,
    errors,
    refreshToken,
  };
};

export default useAuth;