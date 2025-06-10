import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routeConstants } from './features/auth/constants/routeConstants';
import { PROFILE_CONSTANTS } from './features/profile/constants/profileConstants';
import LoginPage from './features/auth/components/LoginForm';
import RegisterPage from './features/auth/components/RegisterForm';
import ForgotPasswordPage from './features/auth/components/ForgotPassword';
import ResetPasswordPage from './features/auth/components/ResetPassword';
import ActivatePage from './features/auth/components/Activation';
import HomePage from './features/home/pages/HomePage';
import ProfilePage from './features/profile/pages/ProfilePage';
import EditProfilePage from './features/profile/pages/EditProfilePage';
import SearchPage from './features/profile/pages/SearchPage';
import FollowersPage from './features/profile/pages/FollowersPage';
import FollowingPage from './features/profile/pages/FollowingPage';
import ProtectedRoute from './ProtectedRoute';
import CreatePostPage from './features/post/pages/CreatePostPage';
import PostDetail from './features/post/components/PostDetail';
import SavedPostsPage from './features/post/pages/SavedPostsPage';
import MessagesList from './features/messages/components/MessagesList';
import MessageThread from './features/messages/components/MessageThread';
import ActivityPage from './features/activity/pages/ActivityPage';
import MainLayout from './components/layout/MainLayout';
import NotFoundPage from './NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path={routeConstants.ROUTE_LOGIN} element={<LoginPage />} />
      <Route path={routeConstants.ROUTE_REGISTER} element={<RegisterPage />} />
      <Route path={routeConstants.ROUTE_ACTIVATE} element={<ActivatePage />} />
      <Route path={routeConstants.ROUTE_FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={routeConstants.ROUTE_RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route
        path={routeConstants.ROUTE_DASHBOARD}
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={`${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_BY_ID}`}
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={routeConstants.ROUTE_EDIT_PROFILE}
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={routeConstants.ROUTE_SEARCH}
        element={
          <ProtectedRoute>
            <MainLayout>
              <SearchPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={`${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOWERS}`}
        element={
          <ProtectedRoute>
            <MainLayout>
              <FollowersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={`${PROFILE_CONSTANTS.PROFILE_BASE_URL}${PROFILE_CONSTANTS.PROFILE_FOLLOWING}`}
        element={
          <ProtectedRoute>
            <MainLayout>
              <FollowingPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreatePostPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:postId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PostDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SavedPostsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ActivityPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MessageThread />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MessagesList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage/>} />
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;