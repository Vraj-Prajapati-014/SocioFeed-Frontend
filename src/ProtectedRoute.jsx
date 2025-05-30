import { Navigate } from 'react-router-dom';
import { routeConstants } from './features/auth/constants/routeConstants';
import useAuth from './features/auth/hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    ); // Added loading UI
  }

  if (!isAuthenticated) {
    return <Navigate to={routeConstants.ROUTE_LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
