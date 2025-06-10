import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { routeConstants } from './features/auth/constants/routeConstants';
import Spinner from './components/common/Spinner/Spinner';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthChecked } = useSelector(state => state.auth);

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="medium" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={routeConstants.ROUTE_LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;