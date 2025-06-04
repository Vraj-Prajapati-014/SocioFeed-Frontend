import { Routes, Route } from 'react-router-dom';
import { routeConstants } from './features/auth/constants/routeConstants';
import LoginPage from './features/auth/components/LoginForm';
import RegisterPage from './features/auth/components/RegisterForm';
import ForgotPasswordPage from './features/auth/components/ForgotPassword';
import ResetPasswordPage from './features/auth/components/ResetPassword';
import ActivatePage from './features/auth/components/Activation';
// import DashboardPage from './features/auth/components/DashboardPage';
import HomePage from './features/home/pages/HomePage';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router-dom';
import useAuth from './features/auth/hooks/useAuth';
import { PROFILE_CONSTANTS } from './features/profile/constants/profileConstants';
import ProfilePage from './features/profile/pages/ProfilePage';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path={routeConstants.ROUTE_HOME}
        element={
          isAuthenticated ? <Navigate to={routeConstants.ROUTE_DASHBOARD} replace /> : <LoginPage />
        }
      />
      <Route path={routeConstants.ROUTE_LOGIN} element={<LoginPage />} />
      <Route path={routeConstants.ROUTE_REGISTER} element={<RegisterPage />} />
      <Route path={routeConstants.ROUTE_ACTIVATE} element={<ActivatePage />} />
      <Route path={routeConstants.ROUTE_FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={routeConstants.ROUTE_RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route
        path={routeConstants.ROUTE_DASHBOARD}
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_BY_USERNAME}`}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
