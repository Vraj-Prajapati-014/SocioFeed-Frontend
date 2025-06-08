
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMeAsync, refreshTokenAsync, setAuthChecked } from '../slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAuthChecked, loading, errors } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isAuthChecked && !loading) {
      dispatch(getMeAsync());
    }
  }, [dispatch, isAuthChecked, loading]);

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