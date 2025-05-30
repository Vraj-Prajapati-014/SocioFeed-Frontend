import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { resetPasswordAsync, clearMessages } from '../slices/authSlice';
import { routeConstants } from '../constants/routeConstants';

function ResetPasswordPage() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errors, successMessage } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      navigate(routeConstants.ROUTE_LOGIN);
    }
  }, [successMessage, navigate]);

  const handleResetPasswordSubmit = formData => {
    dispatch(resetPasswordAsync({ token, formData }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <DynamicForm
        formType="reset-password"
        onSubmit={handleResetPasswordSubmit}
        loading={loading}
        errors={errors}
        successMessage={successMessage}
        additionalProps={{ title: 'Reset Password' }}
      />
    </div>
  );
}

export default ResetPasswordPage;
