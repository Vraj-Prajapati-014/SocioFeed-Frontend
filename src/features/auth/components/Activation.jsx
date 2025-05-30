import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import { showToast } from '../../../utils/helpers/toast';
import { activateAccountAsync, resendActivationAsync, clearMessages } from '../slices/authSlice';
import { routeConstants } from '../constants/routeConstants';

function ActivatePage() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errors, successMessage } = useSelector(state => state.auth);
  const [resendEmail, setResendEmail] = useState('');

  useEffect(() => {
    dispatch(clearMessages());
    dispatch(activateAccountAsync(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, 'success');
      setTimeout(() => {
        navigate(routeConstants.ROUTE_LOGIN);
      }, 3000);
    }
  }, [successMessage, navigate]);

  useEffect(() => {
    if (errors.message && errors.message.includes('expired')) {
      setResendEmail(errors.email || '');
    }
  }, [errors]);

  const handleResendActivation = () => {
    dispatch(resendActivationAsync(resendEmail));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="medium" />
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Activation Successful</h2>
          <p className="text-center text-foreground mb-4">
            Your account has been activated. Redirecting to login...
          </p>
          <p className="text-center text-sm">
            <a href={routeConstants.ROUTE_LOGIN} className="text-primary hover:underline">
              Go to Login
            </a>
          </p>
        </Card>
      </div>
    );
  }

  if (errors.message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Activation Failed</h2>
          <p className="text-center text-foreground mb-4">{errors.message}</p>
          {resendEmail && (
            <Button
              variant="secondary"
              size="medium"
              onClick={handleResendActivation}
              className="w-full mb-4"
              disabled={loading || !resendEmail}
            >
              Resend Activation Link
            </Button>
          )}
          <p className="text-center text-sm">
            <a href={routeConstants.ROUTE_LOGIN} className="text-primary hover:underline">
              Back to Login
            </a>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Activating Account</h2>
        <p className="text-center text-foreground">Please wait...</p>
      </Card>
    </div>
  );
}

export default ActivatePage;
