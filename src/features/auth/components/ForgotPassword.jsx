import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from './DynamicForm';
import { forgotPasswordAsync, clearMessages } from '../slices/authSlice';

function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { loading, errors, successMessage } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const handleForgotPasswordSubmit = formData => {
    dispatch(forgotPasswordAsync(formData));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <DynamicForm
        formType="forgot-password"
        onSubmit={handleForgotPasswordSubmit}
        loading={loading}
        errors={errors}
        successMessage={successMessage}
        additionalProps={{ title: 'Forgot Password' }}
      />
    </div>
  );
}

export default ForgotPasswordPage;
