import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setTheme } from './store/slices/themeSlice';
import { getMeAsync } from './features/auth/slices/authSlice';
import { routeConstants } from './features/auth/constants/routeConstants';
import ThemeContext from './utils/context/ThemeContext';
import { lightTheme, darkTheme } from './styles/theme';
import ThemeToggle from './components/common/ThemeToggle/ThemeToggle';
import AppRoutes from './AppRoutes';
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const themeMode = useSelector(state => state.theme.mode);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') || 'light';
    if (savedTheme !== themeMode) {
      dispatch(setTheme(savedTheme));
    }

    dispatch(getMeAsync()).then(result => {
      setIsAuthChecked(true);
      console.log(result);
    });
  }, [dispatch, themeMode]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      const protectedRoutes = [routeConstants.ROUTE_DASHBOARD];
      if (protectedRoutes.includes(location.pathname)) {
        navigate(routeConstants.ROUTE_LOGIN, { replace: true });
      }
    }
  }, [isAuthenticated, isAuthChecked, location.pathname, navigate]);

  return (
    <ThemeContext.Provider value={{ mode: themeMode }}>
      <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <ToastContainer />
        <div className="min-h-screen bg-background">
          {!isAuthChecked ? (
            <div className="flex items-center justify-center min-h-screen">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              <ThemeToggle className="p-4" />
              <AppRoutes />
            </>
          )}
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
