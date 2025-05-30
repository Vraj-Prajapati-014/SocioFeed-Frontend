import { Navigate } from 'react-router-dom';
import { routeConstants } from './features/auth/constants/routeConstants';
import useAuth from './features/auth/hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // App.jsx handles loading UI
  }

  if (!isAuthenticated) {
    return <Navigate to={routeConstants.ROUTE_LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
