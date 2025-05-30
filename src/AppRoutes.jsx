import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routeConstants } from './features/auth/constants/routeConstants';
import LoginPage from './features/auth/components/LoginForm';
import RegisterPage from './features/auth/components/RegisterForm';
import ForgotPasswordPage from './features/auth/components/ForgotPassword';
import ResetPasswordPage from './features/auth/components/ResetPassword';
import ActivatePage from './features/auth/components/Activation';
import DashboardPage from './features/auth/components/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router-dom';
import useAuth from './features/auth/hooks/useAuth';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        <Route
          path={routeConstants.ROUTE_HOME}
          element={
            isAuthenticated ? (
              <Navigate to={routeConstants.ROUTE_DASHBOARD} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path={routeConstants.ROUTE_HOME} element={<LoginPage />} />
        <Route path={routeConstants.ROUTE_LOGIN} element={<LoginPage />} />
        <Route path={routeConstants.ROUTE_REGISTER} element={<RegisterPage />} />
        <Route path={routeConstants.ROUTE_ACTIVATE} element={<ActivatePage />} />
        <Route path={routeConstants.ROUTE_FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={routeConstants.ROUTE_RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route
          path={routeConstants.ROUTE_DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
