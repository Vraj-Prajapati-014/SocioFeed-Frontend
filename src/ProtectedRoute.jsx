import { Navigate } from 'react-router-dom';
import { routeConstants } from './features/auth/constants/routeConstants';
import useAuth from './features/auth/hooks/useAuth';
import Spinner from './components/common/Spinner/Spinner'; 
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
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