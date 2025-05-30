import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import Button from '../../../components/common/Button/Button';
import { loginAsync, resendActivationAsync, clearMessages } from '../slices/authSlice';
import { routeConstants } from '../constants/routeConstants';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errors, successMessage, activationStatus } = useSelector(state => state.auth);
  const [resendEmail, setResendEmail] = useState('');

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage === 'Login successful') {
      navigate(routeConstants.ROUTE_DASHBOARD);
    }
  }, [successMessage, navigate]);

  const handleLoginSubmit = formData => {
    setResendEmail(formData.email);
    dispatch(loginAsync(formData));
  };

  const handleResendActivation = () => {
    dispatch(resendActivationAsync(resendEmail));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md">
        <DynamicForm
          formType="login"
          onSubmit={handleLoginSubmit}
          loading={loading}
          errors={errors}
          successMessage={successMessage}
          additionalProps={{ title: 'Sign In' }}
        />
        {activationStatus === 'unactivated' && (
          <Button
            variant="secondary"
            size="medium"
            onClick={handleResendActivation}
            className="mt-4 w-full"
            disabled={loading}
          >
            Resend Activation Link
          </Button>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
