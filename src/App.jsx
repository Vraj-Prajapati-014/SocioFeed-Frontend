import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTheme } from './store/slices/themeSlice';
import { getMeAsync } from './features/auth/slices/authSlice';
import { routeConstants } from './features/auth/constants/routeConstants';
import ThemeContext from './utils/context/ThemeContext';
import { lightTheme, darkTheme } from './styles/theme';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './AppRoutes';
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const themeMode = useSelector((state) => state.theme.mode);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') || 'light';
    if (savedTheme !== themeMode) {
      dispatch(setTheme(savedTheme));
    }

    dispatch(getMeAsync()).then(() => {
      setIsAuthChecked(true);
    });
  }, [dispatch, themeMode]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated && location.pathname !== routeConstants.ROUTE_LOGIN) {
      navigate(routeConstants.ROUTE_LOGIN, { replace: true });
    }
  }, [isAuthChecked, isAuthenticated, location.pathname, navigate]);

  const authRoutes = [
    routeConstants.ROUTE_LOGIN,
    routeConstants.ROUTE_REGISTER,
    routeConstants.ROUTE_FORGOT_PASSWORD,
    routeConstants.ROUTE_RESET_PASSWORD,
    routeConstants.ROUTE_ACTIVATE,
  ];

  const shouldUseLayout = isAuthenticated && !authRoutes.includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: themeMode, mode: themeMode }}>
        <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className={`min-h-screen ${themeMode === 'dark' ? 'dark' : ''}`}>
            {!isAuthChecked ? (
              <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
              </div>
            ) : shouldUseLayout ? (
              <MainLayout>
                <AppRoutes />
              </MainLayout>
            ) : (
              <AppRoutes />
            )}
          </div>
        </ThemeProvider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;