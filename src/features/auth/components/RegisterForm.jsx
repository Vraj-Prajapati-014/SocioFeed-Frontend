import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { registerAsync, clearMessages } from '../slices/authSlice';
import { routeConstants } from '../constants/routeConstants';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errors, successMessage } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearMessages());
    sessionStorage.removeItem('isAuthenticated');
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      navigate(routeConstants.ROUTE_LOGIN);
    }
  }, [successMessage, navigate]);

  const handleRegisterSubmit = formData => {
    dispatch(registerAsync(formData));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <DynamicForm
        formType="register"
        onSubmit={handleRegisterSubmit}
        loading={loading}
        errors={errors}
        successMessage={successMessage}
        additionalProps={{ title: 'Sign Up' }}
      />
    </div>
  );
}

export default RegisterPage;
